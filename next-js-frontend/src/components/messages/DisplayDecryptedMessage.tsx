"use client";
import { useDecryptMessage } from "@/hooks/useUtils/useDecryptMessage";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";

type PropTypes = {
  cipherText: string;
  chat: ChatWithUnreadMessages;
};

export const DisplayDecryptedMessage = ({ cipherText, chat }: PropTypes) => {
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;

  console.log(
    "logging from DisplayDecryptedMessage component",
    loggedInUserId,
    chat._id
  );

  const { decryptedMessage } = useDecryptMessage({
    cipherText,
    loggedInUserId,
    selectedChatDetails: chat,
  });

  return <span>{decryptedMessage}</span>;
};
