"use client";
import { useChatListItemClick } from "@/hooks/useChat/useChatListItemClick";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { selectLoggedInUser } from "@/lib/client/slices/authSlice";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { useAppSelector } from "@/lib/client/store/hooks";
import { ChatListItemBasicInfo } from "./ChatListItemBasicInfo";
import { ChatListItemSecondaryInfo } from "./ChatListItemSecondaryInfo";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/constants";
import { getChatAvatar } from "@/lib/shared/helpers";

type PropTypes = {
  chat: fetchUserChatsResponse;
};

export const ChatListItem = ({ chat }: PropTypes) => {
  const loggedInUserId = useAppSelector(selectLoggedInUser)?.id as string;
  const { handleChatListItemClick } = useChatListItemClick();
  const selectedChatId = useAppSelector(selectSelectedChatDetails)?.id;

  return (
    <div
      onClick={() => handleChatListItemClick(chat.id)}
      className={` ${
        selectedChatId === chat.id ? "bg-secondary-dark" : ""
      }  text-text p-1 flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3`}
    >
      <Image
        className="aspect-square rounded-full object-cover max-md:w-14"
        src={(getChatAvatar(chat, loggedInUserId) as string) || DEFAULT_AVATAR}
        alt="chat avatar"
        width={70}
        height={70}
      />

      <div className="w-full flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2 justify-between w-full shrink-0">
          <ChatListItemBasicInfo chat={chat} />
        </div>
        <div className="flex justify-between items-center shrink-0">
          <ChatListItemSecondaryInfo key={chat.id} chat={chat} />
        </div>
      </div>
    </div>
  );
};
