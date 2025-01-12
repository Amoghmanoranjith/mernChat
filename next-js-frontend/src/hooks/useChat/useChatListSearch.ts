import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { getChatName } from "@/utils/helpers";
import { useEffect, useState } from "react";

type PropTypes = {
  searchVal: string;
  loggedInUserId: string;
  chats: ChatWithUnreadMessages[];
};

export const useChatListSearch = ({
  searchVal,
  loggedInUserId,
  chats,
}: PropTypes) => {
  const [filteredChats, setFilteredChats] = useState<ChatWithUnreadMessages[]>(
    []
  );

  useEffect(() => {
    if (searchVal.trim().length) {
      setFilteredChats(
        chats.filter((chat) =>
          getChatName(chat, loggedInUserId)
            ?.toLowerCase()
            ?.includes(searchVal.toLowerCase())
        )
      );
    }
    else if(searchVal.trim().length==0){
      setFilteredChats([]);
    }
  }, [searchVal]);

  return { filteredChats };
};
