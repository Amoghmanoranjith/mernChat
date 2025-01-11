import { getSocket } from "@/context/socket.context"
import { Event } from "@/interfaces/events.interface"
import { NewReactionEventPayloadData } from "@/interfaces/message.interface"


export const useSendNewReaction = () => {

    const socket = getSocket()

    const sendNewReaction = ({chatId,messageId,reaction}:NewReactionEventPayloadData)=>{
        socket?.emit(Event.NEW_REACTION,{chatId,messageId,reaction})
    }

    return {
        sendNewReaction
    }
}
