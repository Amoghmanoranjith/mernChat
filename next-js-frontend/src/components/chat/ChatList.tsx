"use client";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { sortChats } from "@/utils/helpers";
import { ChatListItem } from "./ChatListItem";

type PropTypes = {
  chats: ChatWithUnreadMessages[];
  isFiltered: boolean;
};

export const ChatList = ({ chats, isFiltered }: PropTypes) => {
  const sortedChats = isFiltered ? chats : sortChats(chats);

  return (
    <div className="flex flex-col gap-y-4">
      {sortedChats.map((chat) => (
        <ChatListItem key={`${chat._id}-${chat.latestMessage?._id}`} chat={chat} />
      ))}
    </div>
  );
};
