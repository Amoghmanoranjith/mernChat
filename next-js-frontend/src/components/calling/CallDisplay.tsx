import { DEFAULT_AVATAR } from "@/constants";
import { useSocket } from "@/context/socket.context";
import { useSocketEvent } from "@/hooks/useSocket/useSocketEvent";
import { Event } from "@/interfaces/events.interface";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { selectIncomingCallInfo, selectIsIncomingCall, setCallDisplay, setInComingCallInfo, setIsIncomingCall } from "@/lib/client/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { peer } from "@/lib/client/webrtc/services/peer";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CallHangIcon } from "../ui/icons/CallHangIcon";
import { CameraOff } from "../ui/icons/CameraOff";
import { CameraOn } from "../ui/icons/CameraOn";
import { MicrophoneMuted } from "../ui/icons/MicrophoneMuted";
import { MicrophoneOn } from "../ui/icons/MicrophoneOn";

type CallUserEventSendPayload = {
    calleeId: string;
    offer: RTCSessionDescriptionInit;
};

export type IncomingCallEventReceivePayload = {
    caller: {
      id:string;
      username:string;
      avatar:string;
    };
    offer: RTCSessionDescriptionInit;
    callHistoryId:string
};

type CallAcceptedEventSendPayload = {
    callerId: string;
    answer: RTCSessionDescriptionInit;
    callHistoryId:string
};

type CallRejectedEventSendPayload = {
    callHistoryId:string
}

type CallEndEventSendPayload = {
    callHistoryId:string
}

type CallAcceptedEventReceivePayload = {
    calleeId: string;
    answer: RTCSessionDescriptionInit;
    callHistoryId:string
};

type NegoNeededEventReceivePayload = {
    offer: RTCSessionDescriptionInit;
    callerId: string;
    callHistoryId:string
};

type NegoDoneEventSendPayload = {
    answer: RTCSessionDescriptionInit;
    callerId:string
    callHistoryId:string
};

type NegoNeededEventSendPayload = {
    calleeId: string;
    offer: RTCSessionDescriptionInit;
    callHistoryId:string
};

type NegoFinalEventReceivePayload = {
    answer: RTCSessionDescriptionInit;
    calleeId: string;
};

const CallDisplay = () => {

    const selectedChatDetails =  useAppSelector(selectSelectedChatDetails);
    const isInComingCall = useAppSelector(selectIsIncomingCall);
    const incomingCallInfo = useAppSelector(selectIncomingCallInfo);

    // my stream
    const [myStream, setMyStream] = useState<MediaStream | null>(null);

    // remote stream
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [remoteAudioStream, setRemoteAudioStream] = useState<MediaStream | null>(null);
    const [remoteVideoStream, setRemoteVideoStream] = useState<MediaStream | null>(null);

    const [isAccepted,setIsAccepted] = useState<boolean>(false);

    const [remoteUserId,setRemoteUserId] = useState<string | null>(null);
    const [callHistoryId,setCallHistoryId] = useState<string | null>(null);

    // user-preferences
    const [micOn,setMicOn] = useState<boolean>(true);
    const [cameraOn,setCameraOn] = useState<boolean>(false);

    const toggleMic = useCallback(()=>{
        setMicOn((prev)=>!prev);
    },[]);

    const toggleCamera = useCallback(()=>{
        setCameraOn((prev)=>!prev);
    },[]);


    const updateStreamAccordingToPreferences = useCallback(async () => {
        try {
            if(!isInComingCall || isAccepted){

                console.log("Updating stream with: ", { micOn, cameraOn });
                // Stop existing tracks before getting a new stream
                myStream?.getTracks().forEach(track => track.stop());
        
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: micOn,
                    video: cameraOn
                });
                console.log('done till here man');
                setMyStream(stream);
            }
        } catch (err) {
            console.error("Error accessing media devices: ", err);
        }
    }, [isInComingCall,isAccepted,micOn, cameraOn]); 
    
    
    const sendStreams = useCallback(()=>{
        console.log('send streams called');
        if(myStream && isAccepted){
            console.log('inside send streams');
            try {
                for(const track of myStream.getTracks()){
                  peer.peer?.addTrack(track,myStream);
                }
            } catch (error) {
                console.log('error in sending streams',error);
            }
        }
      },[myStream,isAccepted])
    
    const socket = useSocket();
    const dispatch = useAppDispatch();

    const callUser = useCallback(async()=>{
        const offer = await peer.getOffer();
        if(offer && selectedChatDetails){
            const payload:CallUserEventSendPayload = {
                calleeId:selectedChatDetails.ChatMembers[0].user.id,
                offer
            }
          socket?.emit(Event.CALL_USER,payload);
        }

        else{
          toast.error("Failed to initiate call");
          dispatch(setCallDisplay(false));
        }
    },[dispatch, selectedChatDetails, socket])

    const handleCallEndClick = useCallback(()=>{

    },[]);

    const handleAcceptCall = useCallback(async()=>{
        if(incomingCallInfo){
            
            const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:false});
            setMyStream(stream);

            const answer = await peer.getAnswer(incomingCallInfo.offer);

            if(!answer){
                toast.error("Failed to accept call");
                const callEndPayload:CallEndEventSendPayload = {
                    callHistoryId:incomingCallInfo.callHistoryId
                }
                socket?.emit(Event.CALL_END,callEndPayload);
                return;
            }

            const callAcceptPayload:CallAcceptedEventSendPayload = {
                callerId:incomingCallInfo.caller.id,
                answer,
                callHistoryId:incomingCallInfo.callHistoryId
            }
            setIsAccepted(true);
            socket?.emit(Event.CALL_ACCEPTED,callAcceptPayload);
            console.log("Call accepeted");
            console.log('now sending streams');
        }
        else{
            toast.error("Some error occured in accepting the call");
            toast.error("Please reload the page and try again");
        }
    },[incomingCallInfo, socket]);

    const handleRejectCall = useCallback(()=>{
        if(incomingCallInfo){
            const payload:CallRejectedEventSendPayload = {
                callHistoryId:incomingCallInfo.callHistoryId
            }
            socket?.emit(Event.CALL_REJECTED,payload);
            dispatch(setCallDisplay(false));
            dispatch(setInComingCallInfo(null));
            dispatch(setIsIncomingCall(false));
        }
        else{
            toast.error("Some error occured in rejecting the call");
        }
    },[dispatch, incomingCallInfo, socket]);

    const handleCallRejected = useCallback(()=>{
        toast.error("Call declined");
        dispatch(setCallDisplay(false));
    },[dispatch])

    const handleCallAcceptedEvent = useCallback(async({answer,callHistoryId,calleeId}:CallAcceptedEventReceivePayload)=>{
        console.log('call accepeted event receive payload',answer,callHistoryId,calleeId);
        peer.setLocalDescription(answer);
        setCallHistoryId(callHistoryId);
        setRemoteUserId(calleeId);
        setIsAccepted(true);
    },[]);

    const handleCallEndEvent = useCallback(()=>{
        toast.success("Call ended");
        dispatch(setCallDisplay(false));
    },[dispatch])
    
    const handleNegoNeededEvent = useCallback(async({callerId,offer,callHistoryId}:NegoNeededEventReceivePayload)=>{
        console.log('neego needed received from server');
        setRemoteUserId(callerId);
        setCallHistoryId(callHistoryId);
        const answer = await peer.getAnswer(offer);

        console.log('answer is',answer);

        if(answer){
            const payload:NegoDoneEventSendPayload = {
                answer,
                callerId,
                callHistoryId
            }
            socket?.emit(Event.NEGO_DONE,payload)
        }
        else{
            toast.error("some error occured in neego needed event recieved from server");
        }
    },[socket])

    const handleNegoNeeded = useCallback(async()=>{
        // alert("nego-triggered");
        const offer = await peer.getOffer();
    
        if(offer && remoteUserId && callHistoryId){
          const payload:NegoNeededEventSendPayload = {
            calleeId:remoteUserId!,
            offer,
            callHistoryId,
          }
          console.log('neego need sent to server');
          socket?.emit(Event.NEGO_NEEDED,payload);
        }
        else{
          toast.error("Error occured in nego needed");
        }
    },[callHistoryId, remoteUserId, socket])
    
    const handleNegoFinalEvent = useCallback(async({answer,calleeId}:NegoFinalEventReceivePayload)=>{
        try {
            peer.setLocalDescription(answer);
        } catch (error) {
            console.log('errir in setting local description',error);
        }
        console.log('Negotiation accepted from',calleeId);
    },[])

    const handleRemoteStream = useCallback(async(e:RTCTrackEvent)=>{
        const remoteStream = e.streams;
        setRemoteStream(remoteStream[0]); 

        const audioTracks = remoteStream[0].getAudioTracks();
        const videoTracks = remoteStream[0].getVideoTracks();

        // Set the audio and video streams based on the tracks
        if (audioTracks.length > 0) {
            const audioStream = new MediaStream(audioTracks);
            setRemoteAudioStream(audioStream);
        } else {
            setRemoteAudioStream(null);
        }

        if (videoTracks.length > 0) {
            const videoStream = new MediaStream(videoTracks);
            setRemoteVideoStream(videoStream);
        } else {
            setRemoteVideoStream(null);
        }
    },[])

    useEffect(()=>{
        // when we dont have an incomoin call, we will call the user
        if(!isInComingCall) callUser();
    },[callUser]);
    
    useEffect(() => {
        // if user changes options like mic or camera, we will update the stream
        console.log('user pref changed triggered');
        updateStreamAccordingToPreferences();
    }, [micOn, cameraOn, updateStreamAccordingToPreferences]);
    
    useEffect(()=>{
        if(myStream){
            console.log('streams changed');
            sendStreams();
        }
    },[myStream])

    useEffect(()=>{
        if(incomingCallInfo){
            setRemoteUserId(incomingCallInfo?.caller.id);
            setCallHistoryId(incomingCallInfo?.callHistoryId);
        }
    },[incomingCallInfo])


    useEffect(()=>{
        peer.peer?.addEventListener("track",handleRemoteStream);
        return ()=>{
            peer.peer?.removeEventListener("track",handleRemoteStream);
        }
    },[handleRemoteStream])

    useEffect(()=>{
        peer.peer?.addEventListener('negotiationneeded',handleNegoNeeded);
        return ()=>{
          peer.peer?.removeEventListener('negotiationneeded',handleNegoNeeded);
        }
    },[handleNegoNeeded])

    useSocketEvent(Event.CALL_ACCEPTED,handleCallAcceptedEvent);
    useSocketEvent(Event.CALL_REJECTED,handleCallRejected);
    useSocketEvent(Event.CALL_END,handleCallEndEvent);    
    useSocketEvent(Event.NEGO_NEEDED,handleNegoNeededEvent);
    useSocketEvent(Event.NEGO_FINAL,handleNegoFinalEvent);

  return (
    <div className="flex justify-center flex-col">
    {!isInComingCall || isAccepted ? (
        <div className="gap-6 flex flex-col">
            <div className=" flex flex-col gap-2 items-center">
                <Image
                src={incomingCallInfo?incomingCallInfo.caller.avatar : selectedChatDetails?.ChatMembers[0].user.avatar || DEFAULT_AVATAR}
                width={200}
                height={200}
                alt="caller-avatar"
                className="bg-green-500 rounded-full size-32"
                />
                <p className="text-xl">{selectedChatDetails?.ChatMembers[0].user.username}</p>
                <div>
                <p className="text-secondary-darker text-lgr">Voice Call</p>
                <p className="text-secondary-darker text-lgr">{remoteUserId?("Connected"):"Ringing..."}</p>
                {
                    remoteUserId && !remoteAudioStream && (
                        <p className="text-lgr text-red-500">Muted</p>
                    )
                }
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <button onClick={toggleMic} className="rounded-3xl p-2 bg-green-500">
                    {micOn?<MicrophoneOn/>:<MicrophoneMuted/>}
                </button>
                <button onClick={toggleCamera} className="rounded-3xl p-2 bg-green-500">
                    {cameraOn?<CameraOn/>:<CameraOff/>}
                </button>
                <button onClick={handleCallEndClick} className="bg-red-500 rounded-3xl p-2"><CallHangIcon/></button>
            </div>

            <div className="flex justify-between">
                {
                    myStream && (
                        <div>
                            <h1>My Stream</h1>
                            <div className="w-[200px] h-[200px] rounded-lg">
                            <video
                                ref={(video) => {
                                    if (video) video.srcObject = myStream;
                                }}
                                width="200"
                                height="200"
                                autoPlay
                                playsInline
                            />
                            </div>
                        </div>
                    )
                }
                {
                    remoteStream && (
                        <div>
                            <h1>Remote Stream</h1>
                            <div className="w-[200px] h-[200px] rounded-lg">
                            <video
                                ref={(video) => {
                                    if (video) video.srcObject = remoteStream;
                                }}
                                width="200"
                                height="200"
                                autoPlay
                                playsInline
                            />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    ):(
        <div className=" gap-6 flex flex-col">
            <div className=" flex flex-col gap-2 items-center">
                <Image width={200} height={200} src={incomingCallInfo?.caller?.avatar || DEFAULT_AVATAR} alt="caller-avatar" className="rounded-full size-32"/>
                <p className="text-xl">{incomingCallInfo?.caller?.username}</p>
                <p className="text-secondary-darker text-lgr">Voice Call</p>
            </div>

            <div className="flex justify-center gap-1">
                {
                    !isAccepted && (
                        <button onClick={handleAcceptCall} className="bg-green-500 px-12 py-2 rounded-3xl">Accept</button>
                    )
                }
                <button onClick={handleRejectCall} className="bg-red-500 px-4 py-2 rounded-3xl">
                    <CallHangIcon/>
                </button>
            </div>
        </div>

    )}
    </div>
  )
}

export default CallDisplay
