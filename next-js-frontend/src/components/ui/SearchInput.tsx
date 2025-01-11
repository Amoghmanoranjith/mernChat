"use client";
import type { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";
import { getChatName } from "@/utils/helpers";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CrossIcon } from "./icons/CrossIcon";
import { SearchIcon } from "./icons/SearchIcon";
import { useGetChatsQuery } from "@/services/api/chat.api";
import { updateFilteredChats } from "@/services/redux/slices/chatSlice";

type PropTypes = {};

export const SearchInputForChatList = ({}: PropTypes) => {
  const { data: chats } = useGetChatsQuery();
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id;
  const [searchVal, setSearchVal] = useState<string>("");
  const [filteredChats, setFilteredChats] = useState<ChatWithUnreadMessages[]>(
    []
  );
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (loggedInUserId && chats) {
      setFilteredChats(
        chats.filter((chat) =>
          getChatName(chat, loggedInUserId)
            ?.toLowerCase()
            ?.includes(searchVal.toLowerCase())
        )
      );
    }
  }, [searchVal, loggedInUserId,chats]);

  useEffect(()=>{
    dispatch(updateFilteredChats(filteredChats));
  },[filteredChats])

  return (
    <div className="flex items-center bg-secondary-dark text-text px-2 rounded-md">
      <SearchIcon />
      <input
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        className="outline-none bg-inherit w-full  px-3 py-3"
        type="text"
        placeholder="Search"
      />

      {searchVal.trim().length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setSearchVal("")}
        >
          <CrossIcon />
        </motion.button>
      )}
    </div>
  );
};
