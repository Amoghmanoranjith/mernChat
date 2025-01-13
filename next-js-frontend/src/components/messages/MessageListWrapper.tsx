"use client";

import { useGetMessages } from "@/hooks/useMessages/useGetMessages";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { MessageListSkeleton } from "../ui/skeleton/MessageListSkeleton";
import { MessageList } from "./MessageList";

type PropTypes = {
  loggedInUserId: string;
};

export const MessageListWrapper = ({ loggedInUserId }: PropTypes) => {
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  const { data, isFetching, isLoading } = useGetMessages();

  if (isFetching || isLoading) {
    return <MessageListSkeleton />;
  }
  if (data && selectedChatDetails) {
    return (
      <MessageList
        messages={data.messages}
        selectedChatDetails={selectedChatDetails}
        totalPages={data.totalPages}
        loggedInUserId={loggedInUserId}
      />
    );
  } else {
    return null;
  }
};
