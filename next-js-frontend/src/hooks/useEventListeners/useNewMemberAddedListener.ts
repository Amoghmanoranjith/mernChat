import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import {
  selectSelectedChatDetails,
  updateSelectedChatMembers,
} from "@/lib/client/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useEffect, useRef } from "react";
import { useSocketEvent } from "../useSocket/useSocketEvent";

type NewMemberAddedEventReceivePayload = {
  chatId: string;
  members: {
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    publicKey: string | null;
    lastSeen: Date | null;
    verificationBadge: boolean;
  }[]
}

export const useNewMemberAddedListener = () => {

  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  const dispatch = useAppDispatch();

  const selectedChatDetailsRef = useRef(selectedChatDetails);

  useEffect(() => {
    selectedChatDetailsRef.current = selectedChatDetails;
  }, [selectedChatDetails]);

  useSocketEvent(Event.NEW_MEMBER_ADDED,({chatId,members}: NewMemberAddedEventReceivePayload) => {

      const areNewMembersAddedInActivelySelectedChat = chatId === selectedChatDetailsRef.current?.id;
      const tranformedMembers = members.map(member=>({user: member}));
      
      dispatch(
        chatApi.util.updateQueryData("getChats", undefined, (draft) => {
          const chat = draft.find(draft => draft.id === chatId);
          if (chat) chat.ChatMembers.push(...tranformedMembers)
        })
      );

      if(areNewMembersAddedInActivelySelectedChat){
        dispatch(updateSelectedChatMembers(tranformedMembers));
      }

    }
  );
};
