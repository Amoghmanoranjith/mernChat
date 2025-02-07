import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import {
  removeUserTyping,
  selectSelectedChatDetails,
  updateUserTyping,
} from "@/lib/client/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useEffect, useRef } from "react";
import { useSocketEvent } from "../useSocket/useSocketEvent";

type UserTypingEventReceivePayload = {
  user:{
      id:string
      username:string
      avatar:string
  },
  chatId:string
}

export const useTypingListener = () => {
  const dispatch = useAppDispatch();

  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  const selectedChatDetailsRef = useRef(selectedChatDetails);

  useEffect(() => {
    selectedChatDetailsRef.current = selectedChatDetails;
  }, [selectedChatDetails]);

  useSocketEvent(Event.USER_TYPING,({chatId,user}: UserTypingEventReceivePayload) => {

      if (selectedChatDetailsRef.current) {

        const isTypinginOpennedChat = chatId === selectedChatDetailsRef.current.id;

        if (isTypinginOpennedChat) {

          const isUserAlreadyTyping = selectedChatDetailsRef.current.typingUsers.some(typingUser => typingUser.id == user.id);

          if (!isUserAlreadyTyping) {
            dispatch(updateUserTyping(user));
            setTimeout(() => {
              dispatch(removeUserTyping(user.id));
            }, 1000);
          }

        }
        
      }
      else {

        let isNewUserPushedInTypingArray: boolean = false;

        dispatch(
          chatApi.util.updateQueryData("getChats", undefined, (draft) => {
            const chat = draft.find(draft => draft.id === chatId);
            if (chat) {
              const isUserAlreadyTyping = chat.typingUsers.some(typingUser => typingUser.id === user.id);
              if (!isUserAlreadyTyping) {
                chat.typingUsers.push(user);
                isNewUserPushedInTypingArray = true;
              }
            }
          })
        )

        if (isNewUserPushedInTypingArray) {
          setTimeout(() => {
            dispatch(
              chatApi.util.updateQueryData("getChats", undefined, (draft) => {
                const chat = draft.find(draft => draft.id === chatId);
                if (chat) {
                  chat.typingUsers = chat.typingUsers.filter(typingUser => typingUser.id !== user.id);
                }
              })
            );
          }, 1000);
        }

      }
    }
  );
};
