import { Event } from "@/interfaces/events.interface";
import { setCallDisplay, setInComingCallInfo, setIsIncomingCall } from "@/lib/client/slices/uiSlice";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useCallback } from "react";
import { useSocketEvent } from "../useSocket/useSocketEvent";
import toast from "react-hot-toast";


export type IncomingCallEventReceivePayload = {
    caller: {
      id:string;
      username:string;
      avatar:string;
    };
    offer: RTCSessionDescriptionInit;
    callHistoryId:string
};

export const useIncomingCallListener = () => {

    const dispatch = useAppDispatch();

    const hanleIncomingCall = useCallback(async(data:IncomingCallEventReceivePayload)=>{
        toast.success("Incoming call event received");
        dispatch(setIsIncomingCall(true));
        dispatch(setInComingCallInfo(data));
        dispatch(setCallDisplay(true));
    },[dispatch])

    useSocketEvent(Event.INCOMING_CALL,hanleIncomingCall);

}
