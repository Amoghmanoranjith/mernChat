"use client";

import { selectSelectedChatId } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";

type PropTypes = {
  children: React.ReactNode;
};

export const MessageFromWrapper = ({ children }: PropTypes) => {
  const selectedChatId = useAppSelector(selectSelectedChatId);
  if (selectedChatId) {
    return children
  }
  return null;
};
