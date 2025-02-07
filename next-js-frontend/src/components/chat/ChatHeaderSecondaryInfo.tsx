import { ChatMember, fetchUserChatsResponse } from "@/lib/server/services/userService";
import {
  formatRelativeTime,
  getOtherMembersOfGroupChatThatAreActive,
} from "@/lib/shared/helpers";
import { ActiveDot } from "../ui/ActiveDot";

type PropTypes = {
  selectedChatDetails: fetchUserChatsResponse;
  otherMemberOfPrivateChat: ChatMember;
  loggedInUserId: string;
};

export const ChatHeaderSecondaryInfo = ({
  selectedChatDetails,
  otherMemberOfPrivateChat,
  loggedInUserId,
}: PropTypes) => {
  const isPrivateChatActive = !selectedChatDetails.isGroupChat && otherMemberOfPrivateChat.isOnline;
  const isPrivateChatInActive = !selectedChatDetails.isGroupChat && !otherMemberOfPrivateChat.isOnline;
  const isGroupChat = selectedChatDetails.isGroupChat;
  const totalMembersInGroupChat = selectedChatDetails.ChatMembers.length;
  const activeMemberCountInGroupChat = getOtherMembersOfGroupChatThatAreActive(
    selectedChatDetails,
    loggedInUserId
  );

  return (
    <>
      {isPrivateChatInActive && (
        <p className="text-secondary-darker max-sm:text-sm">
          last seen{" "}
          {formatRelativeTime(
            JSON.stringify(otherMemberOfPrivateChat?.lastSeen)
          )}
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
