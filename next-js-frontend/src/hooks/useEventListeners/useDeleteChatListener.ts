import { DeleteChatEventReceiveData } from "@/interfaces/chat.interface"
import { Event } from "@/interfaces/events.interface"
import { chatApi } from "@/services/api/chat.api"
import { selectSelectedChatDetails, updateSelectedChatDetails } from "@/services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks"
import toast from "react-hot-toast"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useDeleteChatListener = () => {

    const dispatch = useAppDispatch()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

    useSocketEvent(Event.DELETE_CHAT,({chatId}:DeleteChatEventReceiveData)=>{

        const wasSelectedChatDeleted = selectedChatDetails?._id === chatId

        if(wasSelectedChatDeleted){
            dispatch(updateSelectedChatDetails(null))
            toast.success("Sorry, the chat has been deleted")
        }
        dispatch(
            chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
                const deletedChat = draft.findIndex(draft=>draft._id===chatId)
                draft.splice(deletedChat,1)
            })
        )
    })
}
