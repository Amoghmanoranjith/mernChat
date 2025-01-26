import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type PropTypes = {
  page: number;
  totalPages: number;
  hasMoreMessages: boolean;
  setHasMoreMessages: Dispatch<SetStateAction<boolean>>
  isFetching:boolean;
  getPreviousMessages: ({ chatId, page }: {
    chatId: string;
    page: number;
}) => void
};

export const useFetchMessagesOnPageChange = ({page,totalPages,hasMoreMessages,getPreviousMessages,setHasMoreMessages,isFetching}: PropTypes) => {

  const selectedChatId =  useAppSelector(selectSelectedChatDetails)?._id;

  useEffect(() => {
    // Only fetch messages if the page is greater than 1 (indicating the user wants older messages)
    // and if a selectedChatId exists
    if (page > 1 && hasMoreMessages && selectedChatId && !isFetching) {
      console.log('page value changed page=',page);
      console.log('calling getPreviousMessage function');

      getPreviousMessages({page,chatId:selectedChatId});
    }
    // If the current page equals totalPages, then there are no more messages to load
    if (page === totalPages){
        setHasMoreMessages(false);
    }
  }, [page]);
};
