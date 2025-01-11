"use client";
import type { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import Image from "next/image";
import {
  formatRelativeTime,
  getChatAvatar,
  getChatName,
} from "../../utils/helpers";
import { TypingIndicator } from "../messages/TypingIndicator";
import { ActiveDot } from "../ui/ActiveDot";
import { VerificationBadgeIcon } from "../ui/icons/VerificationBadgeIcon";
import { ChatListItemWrapper } from "./ChatListItemWrapper";
import { ChatMessageDecryptionWrapper } from "./ChatMessageDecryptionWrapper";

type PropTypes = {
  chat: ChatWithUnreadMessages;
  loggedInUserId: string;
};

export const ChatListItem = ({ chat, loggedInUserId }: PropTypes) => {
  const otherMembersOfChat = chat.members.filter(
    (member) => member._id !== loggedInUserId
  )[0];

  const renderOnlineStatus = () => {
    if (chat.isGroupChat) {
      const onlineMembers = chat.members.filter(
        (member) => member._id !== loggedInUserId && member.isActive
      ).length;

      return (
        onlineMembers > 0 && (
          <div className="text-sm text-secondary-darker flex items-center gap-x-1 ml-1">
            <ActiveDot />
            <p>{onlineMembers}</p>
          </div>
        )
      );
    } else {
      const otherMember = chat.members.find(
        (member) => member._id !== loggedInUserId
      );
      return otherMember?.isActive ? <ActiveDot /> : null;
    }
  };

  const chatName = getChatName(chat, loggedInUserId)?.substring(0, 16);
  const time = formatRelativeTime(
    new Date(
      chat.unreadMessages.message.createdAt ||
        chat.latestMessage?.createdAt ||
        chat.createdAt
    )
  );

  const getLatestUnreadMessageText = (chat: ChatWithUnreadMessages) => {
    return chat.latestMessage.isPoll
      ? "Sent a poll"
      : chat.latestMessage.url
      ? "Sent a gif"
      : chat.latestMessage.attachments?.length
      ? "Sent an attachment"
      : null;
  };

  return (
    <ChatListItemWrapper key={chat._id} chatId={chat._id}>
      <Image
        className="aspect-square rounded-full object-cover max-md:w-14"
        src={getChatAvatar(chat, loggedInUserId) as string}
        width={64}
        height={64}
        alt="chat avatar"
      />

      <div className="w-full flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2 justify-between w-full">
          <div className="flex items-center gap-x-1">
            <p className="font-medium break-words">{chatName}</p>
            {!chat.isGroupChat && otherMembersOfChat?.verificationBadge && (
              <VerificationBadgeIcon />
            )}
            {renderOnlineStatus()}
          </div>
          <p className="text-sm text-secondary-darker">{time}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-secondary-darker">
            {chat.userTyping.length ? (
              <div className="w-12">
                <TypingIndicator />
              </div>
            ) : chat.latestMessage.content?.length ? (
              <ChatMessageDecryptionWrapper chat={chat} /> // <ChatMessageDecryptionWrapper chat={chat}/>
            ) : (
              getLatestUnreadMessageText(chat)
            )}
          </p>
          {chat.unreadMessages?.count > 0 && (
            <p className="bg-primary flex items-center justify-center text-white rounded-full h-5 w-5 p-2">
              {chat.unreadMessages?.count}
            </p>
          )}
        </div>
      </div>
    </ChatListItemWrapper>
  );
};
