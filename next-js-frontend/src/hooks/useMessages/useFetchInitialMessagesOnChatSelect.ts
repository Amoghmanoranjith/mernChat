import { useEffect } from "react";
import { useGetMessages } from "./useGetMessages";

type PropTypes = {
  selectedChatId: string | null;
};

export const useFetchInitialMessagesOnChatSelect = ({
  selectedChatId,
}: PropTypes) => {
  const { getMessages } = useGetMessages();
  useEffect(() => {
    if (selectedChatId) {
      // Fetch the first page of messages when the selectedChatId changes
      getMessages({ _id: selectedChatId, page: 1 }, true);
    }
  }, [selectedChatId, getMessages]); // Effect runs whenever selectedChatId or getMessages changes
};
