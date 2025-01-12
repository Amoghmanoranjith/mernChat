"use client";
import { useChatListSearch } from "@/hooks/useChat/useChatListSearch";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { useState } from "react";
import { SearchInputForChatList } from "../ui/SearchInput";
import { ChatList } from "./ChatList";

type PropTypes = {
  chats: ChatWithUnreadMessages[];
};

export const ChatListWithSearchInput = ({ chats }: PropTypes) => {
  const [searchVal, setSearchVal] = useState<string>("");
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;
  const { filteredChats } = useChatListSearch({
    chats,
    loggedInUserId,
    searchVal,
  });

  return (
    <div className="flex flex-col gap-y-5">
      <SearchInputForChatList
        searchVal={searchVal}
        setSearchVal={setSearchVal}
      />
      <ChatList
        chats={filteredChats.length ? filteredChats : chats}
        isFiltered={filteredChats.length > 0}
      />
    </div>
  );
};
