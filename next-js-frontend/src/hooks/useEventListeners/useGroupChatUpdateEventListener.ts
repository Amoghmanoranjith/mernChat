import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import {
  selectSelectedChatDetails,
  updateChatNameOrAvatar,
} from "@/lib/client/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useEffect, useRef } from "react";
import { useSocketEvent } from "../useSocket/useSocketEvent";

type GroupChatUpdateEventReceivePayload = {
  chatId: string;
  chatAvatar?: string;
  chatName?: string;
}

export const useGroupChatUpdateEventListener = () => {

  const dispatch = useAppDispatch();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  const selectedChatDetailsRef = useRef(selectedChatDetails);

  useEffect(()=>{
    selectedChatDetailsRef.current = selectedChatDetails;
  },[selectedChatDetails])

  useSocketEvent(Event.GROUP_CHAT_UPDATE,({chatId,chatAvatar,chatName}:GroupChatUpdateEventReceivePayload) => {

      dispatch(
        chatApi.util.updateQueryData("getChats", undefined, (draft) => {
          const chat = draft.find(draft => draft.id === chatId);
          if (chat) {
            if (chatName) chat.name = chatName;
            if (chatAvatar) chat.avatar = chatAvatar;
          }
        })
      );

      if(selectedChatDetailsRef.current?.id === chatId){
        dispatch(updateChatNameOrAvatar({avatar:chatAvatar,name:chatName}));
      }
    }
  );



};
