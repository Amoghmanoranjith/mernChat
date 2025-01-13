"use client";
import { useFetchMessagesOnPageChange } from "@/hooks/useMessages/useFetchMessagesOnPageChange";
import { useGetMessages } from "@/hooks/useMessages/useGetMessages";
import { useHandleScroll } from "@/hooks/useMessages/useHandleScroll";
import { usePreserveScrollPositionOnPagination } from "@/hooks/useMessages/usePreserveScrollPositionOnPagination";
import { useScrollBottomAndSetPageTo1AndClearAdditionalMessagesOnChatChange } from "@/hooks/useMessages/useScrollBottomAndSetPageTo1AndClearAdditionalMessagesOnChatChange";
import { useScrollToBottomOnNewMessage } from "@/hooks/useMessages/useScrollToBottomOnNewMessage";
import { useScrollToBottomOnTypingWhenUserIsNearBottom } from "@/hooks/useMessages/useScrollToBottomOnTypingWhenUserIsNearBottom";
import { useSetHasMoreMessagesBasedOnTotalPages } from "@/hooks/useMessages/useSetHasMoreMessagesBasedOnTotalPages";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { Message } from "@/interfaces/message.interface";
import { useRef, useState } from "react";
import { CircleLoading } from "../shared/CircleLoading";
import { MessageCard } from "./MessageCard";
import { TypingIndicator } from "./TypingIndicator";

type PropTypes = {
  messages: Message[];
  selectedChatDetails: ChatWithUnreadMessages;
  totalPages: number;
  loggedInUserId: string;
};

export const MessageList = ({
  messages,
  selectedChatDetails,
  totalPages,
  loggedInUserId,
}: PropTypes) => {
  const selectedChatId = selectedChatDetails._id;

  const { getMessages, isFetching: IsFetchingMessages } = useGetMessages();

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const container = messageContainerRef.current;

  const [page, setPage] = useState<number>(1);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const [openContextMenuMessageId, setOpenContextMenuMessageId] =
    useState<string>();
  const [editMessageId, setEditMessageId] = useState<string>();
  const [reactionMenuMessageId, setReactionMenuMessageId] = useState<
    string | undefined
  >();

  const prevHeightRef = useRef<number>(0);
  const prevScrollTopRef = useRef<number>(0);

  useScrollBottomAndSetPageTo1AndClearAdditionalMessagesOnChatChange({messageContainerRef,setPage,selectedChatId,});
  useSetHasMoreMessagesBasedOnTotalPages({setHasMoreMessages,totalPages,});
  useFetchMessagesOnPageChange({getMessages,page,selectedChatId,setHasMore: setHasMoreMessages,totalPages,});
  useHandleScroll({container,hasMoreMessages,IsFetchingMessages,prevHeightRef,prevScrollTopRef,setIsNearBottom,setPage,});
  useScrollToBottomOnNewMessage({container,isNearBottom,messages,prevHeightRef,prevScrollTopRef,});
  usePreserveScrollPositionOnPagination({container,IsFetchingMessages,page,prevHeightRef,prevScrollTopRef,});
  useScrollToBottomOnTypingWhenUserIsNearBottom({container,isNearBottom,selectedChatDetails,});

  return (
    <>
      <div
        ref={messageContainerRef}
        className="relative flex h-full flex-col gap-y-4 max-xl:gap-y-2 overflow-y-auto overflow-x-hidden"
      >
        {IsFetchingMessages && <CircleLoading />}
        {messages.map((message, index) => (
          <MessageCard
            key={index}
            openContextMenuMessageId={openContextMenuMessageId}
            selectedChatDetails={selectedChatDetails}
            loggedInUserId={loggedInUserId}
            setOpenContextMenuMessageId={setOpenContextMenuMessageId}
            editMessageId={editMessageId}
            setEditMessageId={setEditMessageId}
            message={message}
            reactionMenuMessageId={reactionMenuMessageId}
            setReactionMenuMessageId={setReactionMenuMessageId}
          />
        ))}
        <TypingIndicator
          isNearBottom={isNearBottom}
          selectedChatDetails={selectedChatDetails}
        />
      </div>
    </>
  );
};
