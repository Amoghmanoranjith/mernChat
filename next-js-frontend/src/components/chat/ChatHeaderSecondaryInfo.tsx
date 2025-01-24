import {
  ChatMember,
  ChatWithUnreadMessages,
} from "@/interfaces/chat.interface";
import {
  formatRelativeTime,
  getOtherMembersOfGroupChatThatAreActive,
} from "@/utils/helpers";
import { ActiveDot } from "../ui/ActiveDot";

type PropTypes = {
  selectedChatDetails: ChatWithUnreadMessages;
  otherMemberOfPrivateChat: ChatMember;
  loggedInUserId: string;
};

export const ChatHeaderSecondaryInfo = ({
  selectedChatDetails,
  otherMemberOfPrivateChat,
  loggedInUserId,
}: PropTypes) => {

  const isPrivateChatActive = !selectedChatDetails.isGroupChat && otherMemberOfPrivateChat?.isActive;
  const isPrivateChatInActive = !selectedChatDetails.isGroupChat && !otherMemberOfPrivateChat?.isActive;
  const isGroupChat = selectedChatDetails.isGroupChat;
  const totalMembersInGroupChat = selectedChatDetails.members.length;
  const activeMemberCountInGroupChat = getOtherMembersOfGroupChatThatAreActive(selectedChatDetails,loggedInUserId);

  return (
    <>
      {isPrivateChatInActive && (
        <p className="text-secondary-darker max-sm:text-sm">
          last seen {formatRelativeTime(otherMemberOfPrivateChat?.lastSeen)}
        </p>
      )} 
      
      {isPrivateChatActive && (
        <div className="flex items-center gap-x-2">
          <ActiveDot />
          <p className="text-secondary-darker max-sm:text-sm">Active</p>
        </div>
      )}
      
      {isGroupChat && (
        <>
          <p className="text-secondary-darker max-sm:text-sm">
            {totalMembersInGroupChat - 1} Members
          </p>
          <div className="flex items-center gap-x-2">
            <ActiveDot />
            <span className="text-secondary-darker max-sm:text-sm">
              {`${activeMemberCountInGroupChat.length} online`}
            </span>
          </div>
        </>
      )}
    </>
  );
};
