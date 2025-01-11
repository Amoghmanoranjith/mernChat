import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { useEffect } from "react";

type PropTypes = {
  container: HTMLDivElement | null;
  isNearBottom: boolean;
  selectedChatDetails: ChatWithUnreadMessages | null;
};

export const useScrollToBottomOnTypingWhenUserIsNearBottom = ({
  container,
  isNearBottom,
  selectedChatDetails,
}: PropTypes) => {
  // this hook is responsible for scrolling to bottom when other user's are typing but only if the user is near the bottom
  // as if the user is reading old messages and someone starts typing, we don't want to scroll to bottom
  useEffect(() => {
    if (
      container &&
      selectedChatDetails &&
      selectedChatDetails?.userTyping.length > 0 &&
      isNearBottom
    ) {
      container.scrollTop = container.scrollHeight;
    }
  }, [selectedChatDetails?.userTyping]);
};
