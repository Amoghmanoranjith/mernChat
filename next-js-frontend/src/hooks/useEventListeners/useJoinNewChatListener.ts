import { getSocket } from "@/context/socket.context"
import { useSocketEvent } from "../useSocket/useSocketEvent"
import { Event } from "@/interfaces/events.interface"

export const useJoinNewChatListener = () => {

    const socket = getSocket()

    useSocketEvent(Event.JOIN_NEW_CHAT,(chatId:string)=>{
        socket?.emit(Event.JOIN_NEW_CHAT,chatId)
    })
}
