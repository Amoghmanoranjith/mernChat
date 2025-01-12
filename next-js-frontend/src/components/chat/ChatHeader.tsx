"use client";
import { useToggleChatDetailsBar } from "@/hooks/useUI/useToggleChatDetailsBar";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import Image from "next/image";
import { useMediaQuery } from "../../hooks/useUtils/useMediaQuery";
import {
  formatRelativeTime,
  getChatAvatar,
  getChatName,
  getOtherMemberOfPrivateChat
} from "../../utils/helpers";
import { VerificationBadgeIcon } from "../ui/icons/VerificationBadgeIcon";
import { ChatHeaderOnlineStatusDisplay } from "./ChatHeaderOnlineStatusDisplay";

type PropTypes = {
  selectedChatDetails: ChatWithUnreadMessages;
};

export const ChatHeader = ({ selectedChatDetails }: PropTypes) => {
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;
  const toggleChatDetailsBar = useToggleChatDetailsBar();

  const is2xl = useMediaQuery(1536);

  const otherMemberOfPrivateChat = getOtherMemberOfPrivateChat(selectedChatDetails, loggedInUserId);

  const displayVerfiicationBadgeOnPrivateChatIfOtherPersonHaveIt = () => {
    if(!selectedChatDetails.isGroupChat && otherMemberOfPrivateChat.verificationBadge){
      return <VerificationBadgeIcon />
    }
  };

  const displayLastSeenInPrivateChatIfOtherPersonIsNotActive = () => {
    if(!selectedChatDetails.isGroupChat && !otherMemberOfPrivateChat.isActive){
      return (
        <p className="text-secondary-darker max-sm:text-sm">
          last seen {formatRelativeTime(otherMemberOfPrivateChat.lastSeen)}
        </p>
      )
    }
  };

  const displayTotalMembersIfGroupChat = () => {
    if(selectedChatDetails.isGroupChat){
      return (
        <p className="text-secondary-darker max-sm:text-sm">
          {selectedChatDetails.members.length - 1} Members
        </p>
      )
    }
  };

  const chatName = getChatName(selectedChatDetails, loggedInUserId) as string;
  const chatAvatar = getChatAvatar(selectedChatDetails, loggedInUserId) as string;

  return (
      <div onClick={() => (is2xl ? toggleChatDetailsBar() : "")} className="flex items-center justify-between text-text">

          <div className="flex gap-x-3">
            
            <Image className="w-14 h-14 rounded-full max-sm:w-10 max-sm:h-10" src={chatAvatar} alt={"chat-avatar"} width={56} height={56} />

            <div className="flex flex-col gap-y-1 max-sm:gap-y-[.5px]">
              <div className="flex items-center gap-x-1">
                <h4 className="font-medium text-4xl max-sm:text-2xl">{chatName}</h4>
                <span>{displayVerfiicationBadgeOnPrivateChatIfOtherPersonHaveIt()}</span>
              </div>
              <div className="flex items-center gap-x-2">
                {displayLastSeenInPrivateChatIfOtherPersonIsNotActive()}
                {displayTotalMembersIfGroupChat()}
                <ChatHeaderOnlineStatusDisplay selectedChatDetails={selectedChatDetails}/>
              </div>
            </div>

          </div>

      </div>
    )
};
