import { Event } from "@/interfaces/events.interface";
import { Message } from "@/interfaces/message.interface";
import { chatApi } from "@/services/api/chat.api";
import { messageApi } from "@/services/api/message.api";
import { removeUserTyping, selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";
import { useEffect, useRef } from "react";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useMessageListener = () => {

  const selectedChatDetails =  useAppSelector(selectSelectedChatDetails);
  const selectedChatDetailsRef =  useRef(selectedChatDetails);

  useEffect(()=>{
    if(selectedChatDetailsRef.current!=selectedChatDetails){
      selectedChatDetailsRef.current=selectedChatDetails;
    }
  },[selectedChatDetails])

  const dispatch = useAppDispatch();

  useSocketEvent(Event.MESSAGE, async (newMessage: Message) => {
    
    dispatch(
      messageApi.util.updateQueryData("getMessagesByChatId",{ chatId: newMessage.chat, page: 1 },(draft) => {
          draft.messages.push(newMessage);
          if (!draft.totalPages) draft.totalPages = 1;
        }
      )
    );


    dispatch(
      chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
        const chat = draft.find(draft=>draft._id===newMessage.chat);

        if(chat){
          chat.latestMessage=newMessage

          const isMessageReceivedInSelectedChat = newMessage.chat === selectedChatDetailsRef.current?._id;

          if(isMessageReceivedInSelectedChat){
            const ifUserWhoWasTypingHasSentTheMessage = selectedChatDetailsRef.current?.userTyping.some(user=>user._id==newMessage.sender._id);
            if(ifUserWhoWasTypingHasSentTheMessage){
              dispatch(removeUserTyping(newMessage.sender._id))
            }
          }
          else{
            const ifUserWhoWasTypingHasSentTheMessage =  chat?.userTyping.some(user=>user._id===newMessage.sender._id)
            if(ifUserWhoWasTypingHasSentTheMessage){
              chat.userTyping=chat.userTyping.filter(user=>user._id!==newMessage.sender._id)
            }
          }
        }
      })
    )



    

  });
};
