"use client";
import { useFetchInitialMessagesOnChatSelect } from "@/hooks/useMessages/useFetchInitialMessagesOnChatSelect";
import { MessageListSkeleton } from "../ui/skeleton/MessageListSkeleton";
import { MessageList } from "./MessageList";

type PropTypes = {
  loggedInUserId: string;
};

export const MessageListWrapper = ({ loggedInUserId }: PropTypes) => {

  const {data,isFetching,isLoading,selectedChatDetails} = useFetchInitialMessagesOnChatSelect();

  if (isFetching || isLoading) {
    return <MessageListSkeleton />;
  }
  if(data && selectedChatDetails) {
    return (
      <MessageList
        messages={data.messages}
        selectedChatDetails={selectedChatDetails}
        totalPages={data.totalPages}
        loggedInUserId={loggedInUserId}
      />
    );
  }
};
