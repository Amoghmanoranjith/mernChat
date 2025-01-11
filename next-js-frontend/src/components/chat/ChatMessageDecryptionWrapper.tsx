"use client";

import { useGetSharedKey } from "@/hooks/useAuth/useGetSharedKey";
import type { ChatMember, ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { decryptMessage } from "@/utils/encryption";
import { useEffect, useState } from "react";

type PropTypes = {
    chat: ChatWithUnreadMessages;
}

export const ChatMessageDecryptionWrapper = ({chat}:PropTypes) => {
 const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;

 const otherMembersOfChat = chat.members.filter(
    (member) => member._id !== loggedInUserId
  )[0];

  const getSharedKey = useGetSharedKey();
  const [decryptedMessage, setDecryptedMessage] = useState<string>();
  const [unreadDecryptedMessage, setUnreadDecryptedMessage] =
    useState<string>();
  const [sharedKey, setSharedKey] = useState<CryptoKey>();
  const handleSetSharedKey = async (otherMember: ChatMember) => {
    const key = await getSharedKey(loggedInUserId, otherMember);
    if (key) setSharedKey(key);
  };

  const handleSetDecryptMessage = async (sharedKey: CryptoKey) => {
    if (chat.latestMessage?.content?.length) {
      const decryptedMsg = await decryptMessage(
        sharedKey,
        chat.latestMessage.content
      );
      if (decryptedMsg) setDecryptedMessage(decryptedMsg);
    }
  };

  const handleSetUnreadDecryptedMessage = async (message: string) => {
    if (sharedKey) {
      const msg = await decryptMessage(sharedKey, message);
      if (msg) setUnreadDecryptedMessage(msg);
    }
  };

  useEffect(() => {
    if (!chat.isGroupChat && otherMembersOfChat) {
      handleSetSharedKey(otherMembersOfChat);
    }
  }, [chat.isGroupChat, otherMembersOfChat]);

  useEffect(() => {
    if (sharedKey && chat.unreadMessages.message?.content) {
      handleSetUnreadDecryptedMessage(chat.unreadMessages.message?.content);

      if (chat.latestMessage?.content?.length)
        handleSetDecryptMessage(sharedKey);
    }
  }, [
    sharedKey,
    chat.unreadMessages.message?.content,
    chat.latestMessage?.content,
  ]);

  return <span>{decryptedMessage}</span>;
};
