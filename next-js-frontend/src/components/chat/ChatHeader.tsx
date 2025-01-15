"use client";
import { useChatHeaderClick } from "@/hooks/useChat/useChatHeaderClick";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import Image from "next/image";
import {
  getChatAvatar,
  getOtherMemberOfPrivateChat,
} from "../../utils/helpers";
import { ChatHeaderBasicInfo } from "./ChatHeaderBasicInfo";
import { ChatHeaderSecondaryInfo } from "./ChatHeaderSecondaryInfo";
import { DEFAULT_AVATAR } from "@/constants";

type PropTypes = {
  selectedChatDetails: ChatWithUnreadMessages;
};

export const ChatHeader = ({ selectedChatDetails }: PropTypes) => {
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;

  const otherMemberOfPrivateChat = getOtherMemberOfPrivateChat(
    selectedChatDetails,
    loggedInUserId
  );

  const { handleChatHeaderClick } = useChatHeaderClick();

  const chatAvatar = getChatAvatar(
    selectedChatDetails,
    loggedInUserId
  ) as string;

  return (
    <div
      onClick={handleChatHeaderClick}
      className="flex items-center justify-between text-text"
    >
      <div className="flex gap-x-3">
        <Image
          className="w-14 h-14 rounded-full max-sm:w-10 max-sm:h-10"
          src={chatAvatar || DEFAULT_AVATAR}
          alt={"chat-avatar"}
          width={56}
          height={56}
        />
        <div className="flex flex-col gap-y-1 max-sm:gap-y-[.5px]">
          <div className="flex items-center gap-x-1">
            <ChatHeaderBasicInfo
              loggedInUserId={loggedInUserId}
              otherMemberOfPrivateChat={otherMemberOfPrivateChat}
              selectedChatDetails={selectedChatDetails}
            />
          </div>
          <div className="flex items-center gap-x-2">
            <ChatHeaderSecondaryInfo
              otherMemberOfPrivateChat={otherMemberOfPrivateChat}
              selectedChatDetails={selectedChatDetails}
              loggedInUserId={loggedInUserId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
