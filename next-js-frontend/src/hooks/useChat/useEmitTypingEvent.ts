import { getSocket } from "@/context/socket.context"
import { useEffect } from "react"
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice"
import { useAppSelector } from "../../services/redux/store/hooks"
import { UserTypingEventPayloadData } from "@/interfaces/message.interface"
import { Event } from "@/interfaces/events.interface"

export const useEmitTypingEvent = (isTyping:string) => {
    
    const socket = getSocket()
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useEffect(()=>{

        if(selectedChatDetails && isTyping){

            const data:UserTypingEventPayloadData  = 
            {
                chatId:selectedChatDetails._id
            }

            socket?.emit(Event.USER_TYPING,data)
        }

    },[isTyping])
}
