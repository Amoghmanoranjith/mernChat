import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { getChatName } from "@/lib/shared/helpers";
import { useEffect, useState } from "react";

type PropTypes = {
  searchVal: string;
  loggedInUserId: string;
  chats: fetchUserChatsResponse[];
};

export const useChatListSearch = ({
  searchVal,
  loggedInUserId,
  chats,
}: PropTypes) => {
  const [filteredChats, setFilteredChats] = useState<fetchUserChatsResponse[]>(
    []
  );

  useEffect(() => {
    if (searchVal.trim().length) {
    } else if (searchVal.trim().length == 0) {
      setFilteredChats([]);
    }
  }, [chats, loggedInUserId, searchVal]);

  return { filteredChats };
};
