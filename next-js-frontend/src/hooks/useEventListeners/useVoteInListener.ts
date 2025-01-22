import { Event } from "@/interfaces/events.interface";
import { VoteInEventReceiveData } from "@/interfaces/message.interface";
import { messageApi } from "@/services/api/message.api";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";
import { useEffect, useRef } from "react";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useVoteInListener = () => {


    const dispatch = useAppDispatch()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

    const selectedChatDetailsRef =  useRef(selectedChatDetails);

    useEffect(()=>{
        selectedChatDetailsRef.current = selectedChatDetails
    },[selectedChatDetails])
    
    useSocketEvent(Event.VOTE_IN,({_id,optionIndex,user}:VoteInEventReceiveData)=>{
        const selectedChatDetails = selectedChatDetailsRef.current;

        if(selectedChatDetails){
            dispatch(
                messageApi.util.updateQueryData("getMessagesByChatId",{chatId:selectedChatDetails._id,page:1},(draft)=>{
    
                    const message = draft.messages.find(draft=>draft._id===_id)
                    if(message && message.isPoll && message.pollOptions){
                        message.pollOptions[optionIndex].votes.push(user)
                    }
    
                })
            )
        }

    })
}
