"use client";
import { useChatListSearch } from "@/hooks/useChat/useChatListSearch";
import { useFilteredChatsVisibility } from "@/hooks/useChat/useFilteredChatsVisibility";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { selectLoggedInUser } from "@/lib/client/slices/authSlice";
import { useAppSelector } from "@/lib/client/store/hooks";
import { useState } from "react";
import { SearchInputForChatList } from "../ui/SearchInput";
import { ChatList } from "./ChatList";

type PropTypes = {
  chats: fetchUserChatsResponse[];
};

export const ChatListWithSearchInput = ({ chats }: PropTypes) => {
  const [searchVal, setSearchVal] = useState<string>("");
  const loggedInUserId = useAppSelector(selectLoggedInUser)?.id as string;
  const { filteredChats } = useChatListSearch({
    chats,
    loggedInUserId,
    searchVal,
  });
  const { showFilteredChats } = useFilteredChatsVisibility({
    filteredChats,
    searchVal,
  });

  return (
    <div className="flex flex-col gap-y-5">
      <SearchInputForChatList
        searchVal={searchVal}
        setSearchVal={setSearchVal}
      />
      <ChatList
        chats={showFilteredChats ? filteredChats : chats}
        isFiltered={showFilteredChats}
      />
    </div>
  );
};
