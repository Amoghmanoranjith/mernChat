"use client";

import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { ChatHeader } from "./ChatHeader";

export const ChatHeaderWrapper = () => {
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  return selectedChatDetails ? (
    <ChatHeader selectedChatDetails={selectedChatDetails} />
  ) : null;
};
