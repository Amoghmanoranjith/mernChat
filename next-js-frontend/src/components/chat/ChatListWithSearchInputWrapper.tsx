"use client";
import { useGetChatsQuery } from "@/services/api/chat.api";
import { ChatListWithSearchInput } from "./ChatListWithSearchInput";
import { ChatListWithSearchSkeleton } from "../ui/skeleton/ChatListWithSearchSkeleton";

export const ChatListWithSearchInputWrapper = () => {
  const { data: chats } = useGetChatsQuery();

  return chats ? (
    <ChatListWithSearchInput chats={chats} />
  ) : (
    <ChatListWithSearchSkeleton />
  );
};
