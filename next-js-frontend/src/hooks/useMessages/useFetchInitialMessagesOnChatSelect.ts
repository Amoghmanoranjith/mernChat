import { selectSelectedChatId } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { useEffect } from "react";
import { useGetMessages } from "./useGetMessages";

export const useFetchInitialMessagesOnChatSelect = () => {
  const { getMessages } = useGetMessages();
  const selectedChatId = useAppSelector(selectSelectedChatId);
  useEffect(() => {
    if (selectedChatId) {
      // Fetch the first page of messages when the selectedChatId changes
      getMessages({ _id: selectedChatId, page: 1 }, true);
    }
  }, [selectedChatId, getMessages]); // Effect runs whenever selectedChatId changes
};
