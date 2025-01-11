import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { decryptMessage } from "@/utils/encryption";
import { useEffect, useState } from "react";
import { useGetSharedKey } from "../useAuth/useGetSharedKey";

type PropTypes = {
  cipherText: string;
  loggedInUserId: string;
  selectedChatDetails: ChatWithUnreadMessages;
};

export const useDecryptMessage = ({
  loggedInUserId,
  selectedChatDetails,
  cipherText,
}: PropTypes) => {
  if (selectedChatDetails.isGroupChat) {
    return { decryptedMessage: cipherText };
  }

  const [sharedKey, setSharedKey] = useState<CryptoKey>();
  const [decryptedMessage, setDecryptedMessage] = useState<string>("");

  const { getSharedKey } = useGetSharedKey();

  const otherMember = selectedChatDetails.members.filter(
    (member) => member._id !== loggedInUserId
  )[0];

  const handleSetSharedKey = async () => {
    const key = await getSharedKey(loggedInUserId, otherMember);
    if (key) {
      setSharedKey(key);
    }
  };

  const handleDecryptMessage = async (
    sharedKey: CryptoKey,
    encryptedMessage: string
  ) => {
    const message = await decryptMessage(sharedKey, encryptedMessage);
    if (message) {
      setDecryptedMessage(message);
    }
  };

  useEffect(() => {
    handleSetSharedKey();
  }, []);

  useEffect(() => {
    if (sharedKey) {
      handleDecryptMessage(sharedKey, cipherText);
    }
  }, [sharedKey]);

  return { decryptedMessage };
};
