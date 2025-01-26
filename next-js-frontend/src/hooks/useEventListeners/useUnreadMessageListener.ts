import { getSocket } from "@/context/socket.context"
import { Event } from "@/interfaces/events.interface"
import { MessageSeenEventPayloadData, UnreadMessageEventReceiveData } from "@/interfaces/message.interface"
import { chatApi } from "@/services/api/chat.api"
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice"
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks"
import { useSocketEvent } from "../useSocket/useSocketEvent"
import { useEffect, useRef } from "react"

export const useUnreadMessageListener = () => {

    const socket = getSocket()
    const dispatch = useAppDispatch()

    const selectedChatId = useAppSelector(selectSelectedChatDetails)?._id

    const selectedChatIdRef = useRef(selectedChatId);

    // Update the ref whenever `selectedChatId` changes
    useEffect(() => {
      selectedChatIdRef.current = selectedChatId;
    }, [selectedChatId]);

    useSocketEvent(Event.UNREAD_MESSAGE,({chatId,message}:UnreadMessageEventReceiveData)=>{

        const selectedChatId = selectedChatIdRef.current;

        if(chatId === selectedChatId){
          // if the unread message event is for the chat
          // that the user has already opened currently, emit a message seen event
          // signaling that the user has seen the message
          const payload:MessageSeenEventPayloadData = {chatId:selectedChatId}
          socket?.emit(Event.MESSAGE_SEEN,payload)
        }
        else{
          // if the message has come is in a chat, that the user has not opened actively currently
          // update the unread message count in the chat list
          dispatch(
            chatApi.util.updateQueryData('getChats',undefined,(draft)=>{
              
              // find the chat in which the message has came
              const chat = draft.find(draft=>draft._id===chatId);
              
              // if valid chat id
              if(chat){
                
                chat.unreadMessages.message.poll=false;
                chat.unreadMessages.message.content='';
                chat.unreadMessages.message.attachments=false;
                chat.unreadMessages.message.url=false;

                // firstly increment the unread message count
                chat.unreadMessages.count+=1;

                if(message.poll) chat.unreadMessages.message.poll=true
                else if(message.content?.length) chat.unreadMessages.message.content = message.content
                else if(message.attachments) chat.unreadMessages.message.attachments = true
                else if(message.url) chat.unreadMessages.message.url=true
              }
            })
          )
        }
    
      })
}
