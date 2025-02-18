import { DEFAULT_AVATAR } from "@/constants";
import { useSocket } from "@/context/socket.context";
import { useSocketEvent } from "@/hooks/useSocket/useSocketEvent";
import { Event } from "@/interfaces/events.interface";
import { selectLoggedInUser } from "@/lib/client/slices/authSlice";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { selectIncomingCallInfo, selectIsIncomingCall, setCallDisplay, setInComingCallInfo, setIsIncomingCall } from "@/lib/client/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { peer } from "@/lib/client/webrtc/services/peer";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { getOtherMemberOfPrivateChat } from "@/lib/shared/helpers";
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

type CallEndEventSendPayload = {
    callHistoryId:string
}

const CallDisplay = () => {

    const selectedChatDetails =  useAppSelector(selectSelectedChatDetails) as fetchUserChatsResponse;
    const isInComingCall = useAppSelector(selectIsIncomingCall);
    const incomingCallInfo = useAppSelector(selectIncomingCallInfo);

    const loggedInUserId = useAppSelector(selectLoggedInUser)?.id as string;
    const otherMember = getOtherMemberOfPrivateChat(selectedChatDetails,loggedInUserId);

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
                
                // Stop existing tracks before getting a new stream
                myStream?.getTracks().forEach(track => track.stop());

                if (!micOn && !cameraOn) {
                    toast("As of now you can't turn off both mic and camera at the same time");
                    toast.success("We are working on fixing this issue as soon as possible");
                    const emptyStream = new MediaStream(); // Empty stream
                    // emptyStream.addTrack(new MediaStreamTrack());
                    // emptyStream.addTrack(new MediaStreamTrack());
                    setMyStream(emptyStream);
                    return;
                }
        
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: micOn,
                    video: cameraOn
                });
                setMyStream(stream);
            }
        } catch (err) {
            console.error("Error accessing media devices: ", err);
        }
    }, [isInComingCall,isAccepted,micOn, cameraOn]); 
    
    
    const sendStreams = useCallback(()=>{
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
                calleeId:selectedChatDetails.ChatMembers.filter(member=>member?.user?.id !== loggedInUserId)[0]?.user?.id,
                offer
            }
          socket?.emit(Event.CALL_USER,payload);
        }

        else{
          toast.error("Failed to initiate call");
          dispatch(setCallDisplay(false));
        }
    },[dispatch, selectedChatDetails, socket])

    const handleCallEndClick = useCallback(() => {

        if(callHistoryId) {
            toast.success("call ended");
            const payload:CallEndEventSendPayload = {
                callHistoryId
            }
            socket?.emit(Event.CALL_END, payload);
        }
    }, [callHistoryId, socket]);
    
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
        }
        else{
            toast.error("Some error occured in rejecting the call");
        }
    },[incomingCallInfo, socket]);

    const handleCallAcceptedEvent = useCallback(async({answer,callHistoryId,calleeId}:CallAcceptedEventReceivePayload)=>{
        peer.setLocalDescription(answer);
        setCallHistoryId(callHistoryId);
        setRemoteUserId(calleeId);
        setIsAccepted(true);
    },[]);

    const handleCallEndEvent = useCallback(()=>{
        toast.success("Call end event received from server");

        // Close peer connection
        peer.closeConnection();
        // Stop local media tracks
        myStream?.getTracks().forEach(track => track.stop());
        
        // Reset streams
        setMyStream(null);
        setRemoteStream(null);
        setRemoteAudioStream(null);
        setRemoteVideoStream(null);
        dispatch(setInComingCallInfo(null));
        dispatch(setIsIncomingCall(false));

        // finally close the call display modal
        setTimeout(() => {
            dispatch(setCallDisplay(false));    
        }, 2000);

    },[dispatch, myStream])
    
    const handleNegoNeededEvent = useCallback(async({callerId,offer,callHistoryId}:NegoNeededEventReceivePayload)=>{
        setRemoteUserId(callerId);
        setCallHistoryId(callHistoryId);
        const answer = await peer.getAnswer(offer);

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

        const remoteStream = e.streams[0];
        setRemoteStream(remoteStream); 

        const audioTracks = remoteStream.getAudioTracks();
        const videoTracks = remoteStream.getVideoTracks();

        console.log('received audio track',audioTracks[0]);
        console.log('received video track',videoTracks[0]);

        const receivedAudioStream = ((audioTracks.length > 0 && audioTracks[0].enabled) ? new MediaStream(audioTracks) : null);
        const receivedVideoStream = ((videoTracks.length > 0 && videoTracks[0].enabled) ? new MediaStream(videoTracks) : null);


        setRemoteAudioStream(receivedAudioStream);
        setRemoteVideoStream(receivedVideoStream);

    },[])

    useEffect(()=>{
        // when we dont have an incomoin call, we will call the user
        if(!isInComingCall) {
            callUser();
        }
    },[isInComingCall]);
    
    useEffect(() => {
        // if user changes options like mic or camera, we will update the stream
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
    useSocketEvent(Event.CALL_END,handleCallEndEvent);    
    useSocketEvent(Event.NEGO_NEEDED,handleNegoNeededEvent);
    useSocketEvent(Event.NEGO_FINAL,handleNegoFinalEvent);
    useSocketEvent(Event.CALL_END,handleCallEndEvent);

    const isBothStreamOpen = myStream?.getVideoTracks()[0] && remoteStream?.getVideoTracks()[0];

  return (
    <div className="flex justify-center flex-col">
    {!isInComingCall || isAccepted ? (
        <div className="gap-6 flex flex-col">

            {/* call info */}
            <div className=" flex flex-col gap-3 items-center">

                {/* image and username */}
                <div className="flex flex-col gap-2 items-center">
                    <Image
                        src={incomingCallInfo?incomingCallInfo.caller.avatar : otherMember?.user?.avatar || DEFAULT_AVATAR}
                        width={200}
                        height={200}
                        alt="caller-avatar"
                        className="bg-green-500 rounded-full size-32"
                    />
                    <span className="text-xl">{incomingCallInfo?incomingCallInfo.caller?.username:otherMember?.user?.username || 'default-user'}</span>
                </div>

                {/* call status and timer */}
                <div className="flex flex-col gap-2 items-center">
                    <p className="text-secondary-darker text-lgr">{remoteUserId?("Ongoing call"):"Ringing..."}</p>
                    {remoteUserId && !remoteAudioStream && (<p className="text-lgr text-red-500">Muted</p>)}
                </div>
            </div>

            {/* action buttons */}
            <div className="flex items-center justify-center gap-2">
                <button onClick={toggleMic} className="rounded-3xl p-2 bg-green-500">
                    {micOn?<MicrophoneOn/>:<MicrophoneMuted/>}
                </button>
                <button onClick={toggleCamera} className="rounded-3xl p-2 bg-green-500">
                    {cameraOn?<CameraOn/>:<CameraOff/>}
                </button>
                <button onClick={handleCallEndClick} className="bg-red-500 rounded-3xl p-2"><CallHangIcon/></button>
            </div>
            
            {/* video stream display */}
            <div className={`flex ${isBothStreamOpen?"justify-between":"justify-center"}`}>
                {
                    myStream?.getVideoTracks()[0] && (
                        <div className="w-[200px] h-[200px] rounded-lg overflow-hidden">
                            <span>My Stream</span>
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
                    )
                }
                {
                    remoteVideoStream && (
                        <div className="w-[200px] h-[200px] rounded-lg overflow-hidden">
                            <span>Remote Stream</span>
                            <video
                                ref={(video) => {
                                    if (video) video.srcObject = remoteVideoStream;
                                }}
                                width="200"
                                height="200"
                                autoPlay
                                playsInline
                            />
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
