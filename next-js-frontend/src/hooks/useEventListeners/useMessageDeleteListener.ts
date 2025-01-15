import { Event } from "@/interfaces/events.interface"
import { messageApi } from "@/services/api/message.api"
import { useAppDispatch } from "@/services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useMessageDeleteListener = () => {

    const dispatch = useAppDispatch()

    useSocketEvent(Event.MESSAGE_DELETE,({messageId,chatId}:{messageId:string,chatId:string})=>{
        dispatch(
            messageApi.util.updateQueryData("getMessagesByChatId",{chatId,page:1},(draft)=>{
                draft.messages = draft.messages.filter(message=>message._id!==messageId)
            })
        )
    })
}
