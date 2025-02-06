import { UserTypingEventReceiveData } from "@/interfaces/chat.interface";
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

export const useTypingListener = () => {
  const dispatch = useAppDispatch();

  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  const selectedChatDetailsRef = useRef(selectedChatDetails);

  useEffect(() => {
    selectedChatDetailsRef.current = selectedChatDetails;
  }, [selectedChatDetails]);

  useSocketEvent(
    Event.USER_TYPING,
    ({ chatId, user }: UserTypingEventReceiveData) => {
      if (selectedChatDetailsRef.current) {
        const isTypinginOpennedChat =
          selectedChatDetailsRef.current &&
          chatId === selectedChatDetailsRef.current._id;

        if (isTypinginOpennedChat) {
          const isUserAlreadyTyping =
            selectedChatDetailsRef.current.userTyping.some(
              (typingUser) => typingUser._id == user._id
            );
          if (!isUserAlreadyTyping) {
            dispatch(updateUserTyping(user));
            setTimeout(() => {
              dispatch(removeUserTyping(user._id));
            }, 1000);
          }
        }
      } else {
        let isNewUserPushedInTypingArray: boolean = false;
        dispatch(
          chatApi.util.updateQueryData("getChats", undefined, (draft) => {
            const chat = draft.find((chat) => chat._id === chatId);
            if (chat) {
              const isUserAlreadyTyping = chat.userTyping.some(
                (typingUser) => typingUser._id === user._id
              );
              if (!isUserAlreadyTyping) {
                chat.userTyping.push(user);
                isNewUserPushedInTypingArray = true;
              }
            }
          })
        );
        if (isNewUserPushedInTypingArray) {
          setTimeout(() => {
            dispatch(
              chatApi.util.updateQueryData("getChats", undefined, (draft) => {
                const chat = draft.find((chat) => chat._id === chatId);
                if (chat) {
                  chat.userTyping = chat.userTyping.filter(
                    (typingUser) => typingUser._id !== user._id
                  );
                }
              })
            );
          }, 1000);
        }
      }
    }
  );
};
