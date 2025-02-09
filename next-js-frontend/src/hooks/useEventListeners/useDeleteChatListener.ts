import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import {
  selectSelectedChatDetails,
  updateSelectedChatDetails,
} from "@/lib/client/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSocketEvent } from "../useSocket/useSocketEvent";

type DeleteChatEventReceivePayload = {
  chatId: string;
}

export const useDeleteChatListener = () => {

  const dispatch = useAppDispatch();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  const selectedChatDetailsRef = useRef(selectedChatDetails);

  useEffect(() => {
    selectedChatDetailsRef.current = selectedChatDetails;
  }, [selectedChatDetails]);

  useSocketEvent(Event.DELETE_CHAT,({chatId}:DeleteChatEventReceivePayload) => {

      const wasActivelySelectedChatDeleted = chatId == selectedChatDetailsRef.current?.id;

      if (wasActivelySelectedChatDeleted) {
        dispatch(updateSelectedChatDetails(null));
        toast.error("Sorry, the chat has been deleted, or you have been removed from this chat");
      }

      dispatch(
        chatApi.util.updateQueryData("getChats", undefined, (draft) => {
          const deletedChat = draft.findIndex(draft => draft.id === chatId);
          draft.splice(deletedChat, 1);
        })
      );
    }
  );
};
