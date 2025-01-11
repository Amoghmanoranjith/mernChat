"use client";

import { useToggleChatBar } from "@/hooks/useUI/useToggleChatBar";
import { useMediaQuery } from "@/hooks/useUtils/useMediaQuery";
import {
  selectSelectedChatDetails,
  updateSelectedChatId,
} from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";

type PropTypes = {
  children: React.ReactNode;
  chatId: string;
};

export const ChatListItemWrapper = ({ children, chatId }: PropTypes) => {
  const toggleChatBar = useToggleChatBar();
  const isLg = useMediaQuery(1024);
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  const handleChatCardClick = (chatId: string) => {
    if (selectedChatDetails?._id !== chatId) {
      updateSelectedChatId(chatId);
    }

    if (isLg) {
      toggleChatBar();
    }
  };

  return (
    <div
      onClick={() => handleChatCardClick(chatId)}
      className={` ${
        selectedChatDetails?._id === chatId ? "bg-secondary-dark" : ""
      }  text-text p-1 flex items-center w-full hover:bg-secondary-dark hover:cursor-pointer gap-x-3`}
    >
      {children}
    </div>
  );
};
