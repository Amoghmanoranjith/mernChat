"use client";

import { useFetchInitialMessagesOnChatSelect } from "@/hooks/useMessages/useFetchInitialMessagesOnChatSelect";
import { selectSelectedChatId } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";

type PropTypes = {
  children: React.ReactNode;
};

export const ChatWrapper = ({ children }: PropTypes) => {
  const selectedChatId = useAppSelector(selectSelectedChatId);
  useFetchInitialMessagesOnChatSelect({ selectedChatId });

  return <div>{children}</div>;
};
