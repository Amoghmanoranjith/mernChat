import { getSocket } from "@/context/socket.context"
import { Event } from "@/interfaces/events.interface"
import { MessageSeenEventPayloadData, UnreadMessageEventReceiveData } from "@/interfaces/message.interface"
import { chatApi } from "@/services/api/chat.api"
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"

export const useUnreadMessageListener = () => {

    const socket = getSocket()
    const dispatch = useAppDispatch()

    const selectedChatDetails = useAppSelector(selectSelectedChatDetails)

    useSocketEvent(Event.UNREAD_MESSAGE,({chatId,message}:UnreadMessageEventReceiveData)=>{
        if(chatId === selectedChatDetails?._id){
          const payload:MessageSeenEventPayloadData = {
            chatId:selectedChatDetails._id,
          }
          socket?.emit(Event.MESSAGE_SEEN,payload)
        }
        else{
          dispatch(
            chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
      
              const chat = draft.find(draft=>draft._id===chatId)

              if(chat){
                chat.unreadMessages.message.url=false
                chat.unreadMessages.message.attachments = false
                chat.unreadMessages.message.poll = false
                chat.unreadMessages.count++
                chat.unreadMessages.message.createdAt = message.createdAt
                
                if(message.poll){
                  chat.unreadMessages.message.poll=true
                }
                if(message.content?.length){
                  chat.unreadMessages.message.content = message.content
                }
                else if(message.attachments){
                  chat.unreadMessages.message.attachments = true
                }
                else if(message.url){
                  chat.unreadMessages.message.url=true
                }
              }
            })
          )
        }
    
      })
}
