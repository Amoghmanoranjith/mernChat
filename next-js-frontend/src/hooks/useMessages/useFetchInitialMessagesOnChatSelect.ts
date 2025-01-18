import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { useEffect } from "react";
import { useGetMessages } from "./useGetMessages";

export const useFetchInitialMessagesOnChatSelect = () => {
  const { getMessages, data, isFetching, isLoading} = useGetMessages();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  useEffect(() => {
    if (selectedChatDetails) {
      // Fetch the first page of messages when the selectedChatId changes
      getMessages({ chatId: selectedChatDetails._id, page: 1 }, true);
    }
  }, [selectedChatDetails, getMessages]); // Effect runs whenever selectedChatId changes

  return {data, isFetching, isLoading,selectedChatDetails}
};
