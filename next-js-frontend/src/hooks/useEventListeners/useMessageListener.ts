import { Event } from "@/interfaces/events.interface";
import { Message } from "@/interfaces/message.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { messageApi } from "@/lib/client/rtk-query/message.api";
import {
  removeUserTyping,
  selectSelectedChatDetails,
} from "@/lib/client/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useEffect, useRef } from "react";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useMessageListener = () => {

  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  const selectedChatDetailsRef = useRef(selectedChatDetails);

  useEffect(() => {
    if (selectedChatDetailsRef.current != selectedChatDetails) selectedChatDetailsRef.current = selectedChatDetails;
  }, [selectedChatDetails]);

  const dispatch = useAppDispatch();

  useSocketEvent(Event.MESSAGE, async (newMessage: Message) => {
    dispatch(
      messageApi.util.updateQueryData("getMessagesByChatId",{ chatId: newMessage.chatId, page: 1 },(draft) => {
          draft.messages.push(newMessage);
          if (!draft.totalPages) draft.totalPages = 1;
        }
      )
    );

    dispatch(
      chatApi.util.updateQueryData("getChats", undefined, (draft) => {

        const chat = draft.find((draft) => draft.id === newMessage.chatId);

        if (chat) {

          chat.latestMessage = newMessage;

          const isMessageReceivedInSelectedChat = newMessage.chatId === selectedChatDetailsRef.current?.id;

          if (isMessageReceivedInSelectedChat) {
            const ifUserWhoWasTypingHasSentTheMessage = selectedChatDetailsRef.current?.typingUsers.some(({id}) => id === newMessage.sender.id);
            if (ifUserWhoWasTypingHasSentTheMessage) dispatch(removeUserTyping(newMessage.sender.id));
          }
          else {
            const ifUserWhoWasTypingHasSentTheMessage = chat?.typingUsers.some(({id}) => id === newMessage.sender.id);
            if (ifUserWhoWasTypingHasSentTheMessage){
              chat.typingUsers = chat.typingUsers.filter((user) => user.id !== newMessage.sender.id);
            }
          }
        }
      })
    );
  });
};
