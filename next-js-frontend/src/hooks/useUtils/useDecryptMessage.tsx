import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { decryptMessage } from "@/utils/encryption";
import { getOtherMemberOfPrivateChat } from "@/utils/helpers";
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

  const [sharedKey, setSharedKey] = useState<CryptoKey>();
  const [decryptedMessage, setDecryptedMessage] = useState<string>("");

  const { getSharedKey } = useGetSharedKey();

  const otherMember = getOtherMemberOfPrivateChat(
    selectedChatDetails,
    loggedInUserId
  );

  const handleSetSharedKey = async () => {
    const key = await getSharedKey({loggedInUserId,otherMember});
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
