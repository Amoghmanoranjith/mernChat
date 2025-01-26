import { Dispatch, SetStateAction, useEffect } from "react";

type PropTypes = {
  totalPages: number;
  setHasMoreMessages: Dispatch<SetStateAction<boolean>>
};

export const useSetHasMoreMessagesBasedOnTotalPages = ({setHasMoreMessages,totalPages}:PropTypes) => {
    useEffect(() => {
        // Set hasMoreMessages based on the total number of pages
        // If there's only 1 page, there are no more messages to load
        // Otherwise, set hasMoreMessages to true to indicate there are more messages
        totalPages === 1 ? setHasMoreMessages(false) : setHasMoreMessages(true);
      }, [totalPages]);
};
