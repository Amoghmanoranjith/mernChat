import { Event } from "@/interfaces/events.interface";
import { setIsInCall } from "@/lib/client/slices/callSlice";
import { setCallDisplay, setInComingCallInfo, setIsIncomingCall } from "@/lib/client/slices/uiSlice";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { peer } from "@/lib/client/webrtc/services/peer";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useCallEndListener = () => {

    const dispatch = useAppDispatch();

    const handleCallEndEvent = useCallback(()=>{

        dispatch(setCallDisplay(false));

        // peer.closeConnection();
        toast.success("Call ended");
        
        dispatch(setInComingCallInfo(null));
        dispatch(setIsIncomingCall(false));
        dispatch(setIsInCall(false));

    },[dispatch])

    useSocketEvent(Event.CALL_END,handleCallEndEvent);
}
