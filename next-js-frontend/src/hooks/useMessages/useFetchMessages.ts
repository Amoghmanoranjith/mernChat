import { useEffect } from "react";
import { useGetMessages } from "./useGetMessages";
import { useAppSelector } from "../../lib/client/store/hooks";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";

export const useFetchMessages = () => {
  const selectedChatId = useAppSelector(selectSelectedChatDetails)?._id;
  const { getMessages, data, isFetching, isLoading } = useGetMessages();

  useEffect(() => {
    if (selectedChatId) {
      getMessages({ chatId: selectedChatId, page: 1 }, true);
    }
  }, [selectedChatId]);

  return {
    isMessagesFetching: isFetching,
    isMessagesLoading: isLoading,
    messages: data?.messages,
    fetchMoreMessages: getMessages,
    totalMessagePages: data?.totalPages,
  };
};
