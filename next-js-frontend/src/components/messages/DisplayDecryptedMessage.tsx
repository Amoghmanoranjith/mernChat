"use client";
import { useDecryptMessage } from "@/hooks/useUtils/useDecryptMessage";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/lib/client/slices/authSlice";
import { useAppSelector } from "@/lib/client/store/hooks";

type PropTypes = {
  cipherText: string;
  chat: ChatWithUnreadMessages;
};

export const DisplayDecryptedMessage = ({ cipherText, chat }: PropTypes) => {
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;

  const { decryptedMessage } = useDecryptMessage({
    cipherText,
    loggedInUserId,
    selectedChatDetails: chat,
  });

  return (
    <span>
      {decryptedMessage.length > 16
        ? decryptedMessage.substring(0, 20) + "..."
        : decryptedMessage}
    </span>
  );
};
