import { NewMemberAddedEventPayloadData } from "@/interfaces/chat.interface"
import { Event } from "@/interfaces/events.interface"
import { chatApi } from "@/services/api/chat.api"
import { selectSelectedChatDetails, updateSelectedChatMembers } from "@/services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks"
import { useEffect, useRef } from "react"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useNewMemberAddedListener = () => {

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)
    const dispatch = useAppDispatch()

    const selectedChatDetailsRef = useRef(selectedChatDetails);

    useEffect(()=>{
        selectedChatDetailsRef.current = selectedChatDetails;
    },[selectedChatDetails])

    useSocketEvent(Event.NEW_MEMBER_ADDED,({chatId,members}:NewMemberAddedEventPayloadData)=>{
        const areNewMembersAddedInSelectedChat:boolean = chatId===selectedChatDetailsRef.current?._id;
        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                const chat = draft.find(draft=>draft._id===chatId)
                if(chat){
                    if(areNewMembersAddedInSelectedChat) dispatch(updateSelectedChatMembers(members));
                    chat.members.push(...members);
                }
            })
        )

    })
}
