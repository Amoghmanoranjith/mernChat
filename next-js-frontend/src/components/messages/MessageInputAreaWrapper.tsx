"use client";

import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { MessageInputArea } from "../chat/MessageInputArea";

export const MessageInputAreaWrapper = () => {
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  return selectedChatDetails ? (
    <MessageInputArea selectedChatDetails={selectedChatDetails} />
  ) : null;
};
