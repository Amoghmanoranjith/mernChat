import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import {
  getOtherMemberOfPrivateChat,
  getOtherMembersOfGroupChatThatAreActive,
} from "@/utils/helpers";
import { ActiveDot } from "../ui/ActiveDot";

type PropTypes = {
  selectedChatDetails: ChatWithUnreadMessages;
};

export const ChatHeaderOnlineStatusDisplay = ({
  selectedChatDetails,
}: PropTypes) => {
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;

  if (selectedChatDetails.isGroupChat) {
    const onlineMembersCount = getOtherMembersOfGroupChatThatAreActive(
      selectedChatDetails,
      loggedInUserId
    ).length;
    return (
      <div className="flex items-center gap-x-2">
        <ActiveDot />
        <span className="text-secondary-darker max-sm:text-sm">
          {`${onlineMembersCount} online`}
        </span>
      </div>
    );
  } else {
    const otherMember = getOtherMemberOfPrivateChat(
      selectedChatDetails,
      loggedInUserId
    );
    if (otherMember.isActive) {
      return (
        <div className="flex items-center gap-x-2">
          <ActiveDot />
          <p className="text-secondary-darker max-sm:text-sm">Active</p>
        </div>
      );
    }
  }
};
