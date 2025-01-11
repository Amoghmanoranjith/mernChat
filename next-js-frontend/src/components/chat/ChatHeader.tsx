"use client";
import { useToggleChatDetailsBar } from "@/hooks/useUI/useToggleChatDetailsBar";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import Image from "next/image";
import { useMediaQuery } from "../../hooks/useUtils/useMediaQuery";
import {
  formatRelativeTime,
  getChatAvatar,
  getChatName,
} from "../../utils/helpers";
import { ActiveDot } from "../ui/ActiveDot";
import { VerificationBadgeIcon } from "../ui/icons/VerificationBadgeIcon";

type PropTypes = {
  loggedInUserId: string;
};

export const ChatHeader = ({ loggedInUserId }: PropTypes) => {
  const selectedChat = useAppSelector(selectSelectedChatDetails);
  const toggleChatDetailsBar = useToggleChatDetailsBar();

  const is2xl = useMediaQuery(1536);
  const otherMember = selectedChat?.members.filter(
    (member) => member._id !== loggedInUserId
  )[0];

  const renderOnlineStatus = () => {
    if (selectedChat?.isGroupChat) {
      const onlineMembers = selectedChat?.members.filter(
        (member) => member._id !== loggedInUserId && member.isActive
      ).length;
      return (
        <div className="flex items-center gap-x-2">
          <ActiveDot />
          <p className="text-secondary-darker max-sm:text-sm">
            {onlineMembers} {onlineMembers === 1 ? "online" : "online"}
          </p>
        </div>
      );
    } else {
      return otherMember?.isActive ? (
        <div className="flex items-center gap-x-2">
          <ActiveDot />
          <p className="text-secondary-darker max-sm:text-sm">Active</p>
        </div>
      ) : null;
    }
  };

  const displayVerfiicationBadgeOnNonGroupChatsIfOtherPersonHaveIt = () => {
    return (
      !selectedChat?.isGroupChat &&
      otherMember?.verificationBadge && <VerificationBadgeIcon />
    );
  };

  const ifNonGroupChatAndOtherPersonIsNotActiveThenShowLastSeen = () => {
    return (
      !selectedChat?.isGroupChat &&
      !otherMember?.isActive && (
        <p className="text-secondary-darker max-sm:text-sm">
          last seen {formatRelativeTime(otherMember?.lastSeen!)}
        </p>
      )
    );
  };

  const ifGroupChatShowTotalMembers = () => {
    return (
      selectedChat?.isGroupChat && (
        <p className="text-secondary-darker max-sm:text-sm">
          {selectedChat.members.length - 1} Members
        </p>
      )
    );
  };

  const chatName = getChatName(selectedChat, loggedInUserId)?.substring(0, 16);

  return (
    selectedChat && (
      <div className="flex items-center justify-between text-text">
        <div
          onClick={() => (is2xl ? toggleChatDetailsBar() : "")}
          className="flex flex-col gap-y-1"
        >
          <div className="flex gap-x-3">
            <Image
              className="w-14 h-14 rounded-full max-sm:w-10 max-sm:h-10"
              src={getChatAvatar(selectedChat, loggedInUserId) as string}
              alt={"chat-avatar"}
            />
            {/* <div className="flex flex-col gap-y-1"> */}
            <div className="flex flex-col gap-y-1 max-sm:gap-y-[.5px]">
              <div className="flex items-center gap-x-1">
                <h4 className="font-medium text-4xl max-sm:text-2xl">
                  {chatName}
                </h4>
                {displayVerfiicationBadgeOnNonGroupChatsIfOtherPersonHaveIt()}
              </div>
              <div className="flex items-center gap-x-2">
                {ifNonGroupChatAndOtherPersonIsNotActiveThenShowLastSeen()}
                {ifGroupChatShowTotalMembers()}
                {renderOnlineStatus()}
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    )
  );
};
