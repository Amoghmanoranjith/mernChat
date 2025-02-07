"use client";
import { useGetChatsQuery } from "@/lib/client/rtk-query/chat.api";
import { ChatListWithSearchSkeleton } from "../ui/skeleton/ChatListWithSearchSkeleton";
import { ChatListWithSearchInput } from "./ChatListWithSearchInput";

export const ChatListSkeletonWrapper = () => {
  const { currentData } = useGetChatsQuery();

  return currentData ? (
    <ChatListWithSearchInput chats={currentData} />
  ) : (
    <ChatListWithSearchSkeleton />
  );
};
