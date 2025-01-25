import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import {
  formatRelativeTime,
  getChatName,
  getOtherMemberOfPrivateChat,
  getOtherMembersOfGroupChatThatAreActive,
} from "@/utils/helpers";
import { ActiveDot } from "../ui/ActiveDot";
import { VerificationBadgeIcon } from "../ui/icons/VerificationBadgeIcon";

type PropTypes = {
  chat: ChatWithUnreadMessages;
};

export const ChatListItemBasicInfo = ({ chat }: PropTypes) => {
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;

  const renderOnlineStatus = () => {
    if (chat.isGroupChat) {
      const otherActiveMembers = getOtherMembersOfGroupChatThatAreActive(
        chat,
        loggedInUserId
      );
      if (otherActiveMembers?.length) {
        return (
          <div className="text-sm text-secondary-darker flex items-center gap-x-1 ml-1">
            <ActiveDot />
            <p>{otherActiveMembers?.length}</p>
          </div>
        );
      }
    } else {
      const otherMember = getOtherMemberOfPrivateChat(chat, loggedInUserId);
      return otherMember?.isActive ? <ActiveDot /> : null;
    }
  };

  const time = formatRelativeTime(
      JSON.stringify(
        chat.unreadMessages.message?.createdAt ||
        chat.latestMessage?.createdAt ||
        chat.createdAt
      )
  );

  const chatName = getChatName(chat, loggedInUserId) as string;

  return (
    <>
      <div className="flex items-center gap-x-1">
        <p className="font-medium break-words">{chatName}</p>
        <span>
          {!chat.isGroupChat && getOtherMemberOfPrivateChat(chat, loggedInUserId)?.verificationBadge && <VerificationBadgeIcon/>}
        </span>
        <div>{renderOnlineStatus()}</div>
      </div>
      <p className="text-sm text-secondary-darker">{time}</p>
    </>
  );
};
