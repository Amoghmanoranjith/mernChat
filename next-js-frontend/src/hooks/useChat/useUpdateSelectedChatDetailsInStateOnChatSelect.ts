import { useGetChatsQuery } from "@/services/api/chat.api";
import {
  selectSelectedChatId,
  updateSelectedChatDetails,
} from "@/services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";
import { useEffect } from "react";

export const useUpdateSelectedChatDetailsInStateOnChatSelect = () => {
  const dispatch = useAppDispatch();
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const { data: chats } = useGetChatsQuery();
  useEffect(() => {
    if (selectedChatId && chats?.length) {
      const result = chats.find((chat) => chat._id === selectedChatId);
      if (result) {
        dispatch(updateSelectedChatDetails(result));
      }
    }
  }, [selectedChatId, chats]);
};
