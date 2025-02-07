import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useEffect, useRef } from "react";
import { useSocketEvent } from "../useSocket/useSocketEvent";

interface UnreadMessageEventReceivePayload {
  chatId:string,
  message?:{
      textMessageContent?:string | undefined | null
      url?:boolean | undefined | null
      attachments?:boolean
      poll?:boolean
      createdAt:Date
  },
  sender:{
      id:string,
      avatar:string,
      username:string
  }
}

export const useUnreadMessageListener = () => {

  const socket = useSocket();
  const dispatch = useAppDispatch();

  const selectedChatId = useAppSelector(selectSelectedChatDetails)?.id;
  const selectedChatIdRef = useRef(selectedChatId);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useSocketEvent(Event.UNREAD_MESSAGE,({chatId,sender,message}: UnreadMessageEventReceivePayload) => {

      const selectedChatId = selectedChatIdRef.current;

      if (chatId === selectedChatId) {
        // if the unread message event is for the chat
        // that the user has already opened currently, emit a message seen event
        // signaling that the user has seen the message
        const payload = { chatId: selectedChatId };
        socket?.emit(Event.MESSAGE_SEEN, payload);
      } 
      else {
        // if the message has come is in a chat, that the user has not opened actively currently
        // update the unread message count in the chat list
        dispatch(
          chatApi.util.updateQueryData("getChats", undefined, (draft) => {
            // find the chat in which the message has came
            const chat = draft.find((draft) => draft.id === chatId);

            // if valid chat id
            if (chat) {
              // chat.UnreadMessages[0].message.poll = false;
              // chat.unreadMessages.message.content = "";
              // chat.unreadMessages.message.attachments = false;
              // chat.unreadMessages.message.url = false;

              // firstly increment the unread message count
              chat.UnreadMessages[0].count += 1;

              // update the sender of the unread message
              chat.UnreadMessages[0].sender = sender;

              if (message?.poll) chat.UnreadMessages[0].message.isPollMessage = true;
              else if (message?.textMessageContent?.length) chat.UnreadMessages[0].message.textMessageContent = message.textMessageContent;
              else if (message?.attachments) chat.UnreadMessages[0].message.attachments = [{secureUrl:"demo-url"}];
              else if (message?.url) chat.UnreadMessages[0].message.url = 'yes it is a gif';
            }
          })
        );
      }
    }
  );
};
