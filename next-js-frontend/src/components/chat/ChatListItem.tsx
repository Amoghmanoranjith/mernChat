"use client";
import { useChatListItemClick } from "@/hooks/useChat/useChatListItemClick";
import type { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import Image from "next/image";
import { getChatAvatar } from "../../utils/helpers";
import { ChatListItemBasicInfo } from "./ChatListItemBasicInfo";
import { ChatListItemSecondaryInfo } from "./ChatListItemSecondaryInfo";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { DEFAULT_AVATAR } from "@/constants";

type PropTypes = {
  chat: ChatWithUnreadMessages;
};

export const ChatListItem = ({ chat }: PropTypes) => {
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;
  const { handleChatListItemClick } = useChatListItemClick();
  const selectedChatId = useAppSelector(selectSelectedChatDetails)?._id;

  return (
    <div
      onClick={() => handleChatListItemClick(chat._id)}
      className={` ${
        selectedChatId === chat._id ? "bg-secondary-dark" : ""
      }  text-text p-1 flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3`}
    >
      <Image
        className="aspect-square rounded-full object-cover max-md:w-14"
        src={getChatAvatar(chat, loggedInUserId) as string || DEFAULT_AVATAR}
        alt="chat avatar"
        width={70}
        height={70}
      />

      <div className="w-full flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2 justify-between w-full">
          <ChatListItemBasicInfo chat={chat} />
        </div>
        <div className="flex justify-between items-center">
          <ChatListItemSecondaryInfo chat={chat} />
        </div>
      </div>
    </div>
  );
};
