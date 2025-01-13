import { useEffect } from "react";

type PropTypes = {
  page: number;
  totalPages: number;
  selectedChatId: string | null;
  getMessages: (params: { chatId: string; page: number }, isNewFetch: boolean) => void;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useFetchMessagesOnPageChange = ({
  getMessages,
  page,
  totalPages,
  selectedChatId,
  setHasMore,
}: PropTypes) => {
  useEffect(() => {
    // Only fetch messages if the page is greater than 1 (indicating the user wants older messages)
    // and if a selectedChatId exists
    if (page > 1 && selectedChatId) {
      getMessages({chatId: selectedChatId, page}, true);

      // If the current page equals totalPages, then there are no more messages to load
      if (page === totalPages) setHasMore(false);
    }
  }, [page, totalPages, selectedChatId, getMessages, setHasMore]);
};
