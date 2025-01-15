import { MemberRemovedEventReceiveData } from "@/interfaces/chat.interface"
import { Event } from "@/interfaces/events.interface"
import { chatApi } from "@/services/api/chat.api"
import { removeSelectedChatMembers, selectSelectedChatDetails } from "@/services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMemberRemovedListener = () => {


    const dispatch = useAppDispatch()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useSocketEvent(Event.MEMBER_REMOVED,({chatId,membersId}:MemberRemovedEventReceiveData)=>{
        
        const isMemberRemovedFromSelectedChatId = selectedChatDetails?._id === chatId

        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{

                const chat = draft.find(draft=>draft._id===chatId)

                if(chat){

                    chat.members.filter(member=>!membersId.includes(member._id.toString()))

                    if(isMemberRemovedFromSelectedChatId){
                        dispatch(removeSelectedChatMembers(membersId))
                    }
                }

            })
        )
    })
}
