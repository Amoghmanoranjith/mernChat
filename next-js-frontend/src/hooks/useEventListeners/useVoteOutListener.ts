import { Event } from "@/interfaces/events.interface"
import { VoteOutEventReceiveData } from "@/interfaces/message.interface"
import { messageApi } from "@/services/api/message.api"
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks"
import { useEffect, useRef } from "react"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useVoteOutListener = () => {


    const dispatch = useAppDispatch()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

    const selectedChatDetailsRef =  useRef(selectedChatDetails);

    useEffect(()=>{
        selectedChatDetailsRef.current = selectedChatDetails
    },[selectedChatDetails])
    
    useSocketEvent(Event.VOTE_OUT,({_id,optionIndex,user}:VoteOutEventReceiveData)=>{
        const selectedChatDetails = selectedChatDetailsRef.current;
        if(selectedChatDetails){

            dispatch(
                messageApi.util.updateQueryData("getMessagesByChatId",{chatId:selectedChatDetails._id,page:1},(draft)=>{

                    const message = draft.messages.find(draft=>draft._id===_id)
                    
                    if(message && message.isPoll && message.pollOptions){
                        const voteToBeRemovedIndex = message.pollOptions[optionIndex].votes.findIndex(({_id})=>_id===user._id)
                        message.pollOptions[optionIndex].votes.splice(voteToBeRemovedIndex,1)
                    }
    
                })
            )

        }

    })
}
