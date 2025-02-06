"use client";
import { useGetChatsQuery } from "@/lib/client/rtk-query/chat.api";
import { ChatListWithSearchInput } from "./ChatListWithSearchInput";
import { ChatListWithSearchSkeleton } from "../ui/skeleton/ChatListWithSearchSkeleton";

export const ChatListWithSearchInputWrapper = () => {
  const { currentData } = useGetChatsQuery();

  return currentData ? (
    <ChatListWithSearchInput chats={currentData} />
  ) : (
    <ChatListWithSearchSkeleton />
  );
};
