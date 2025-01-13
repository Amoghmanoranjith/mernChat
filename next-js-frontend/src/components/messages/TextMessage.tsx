"use client";
import { useDecryptMessage } from "@/hooks/useUtils/useDecryptMessage";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { useState } from "react";
import { EditMessageForm } from "./EditMessageForm";

type PropTypes = {
  cipherText: string;
  messageId: string;
  editMessageId: string | undefined;
  setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpenContextMenuMessageId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  loggedInUserId: string;
  selectedChatDetails: ChatWithUnreadMessages;
};

export const TextMessage = ({
  cipherText,
  selectedChatDetails,
  messageId,
  editMessageId,
  setEditMessageId,
  setOpenContextMenuMessageId,
  loggedInUserId,
}: PropTypes) => {
  const { decryptedMessage } = useDecryptMessage({
    cipherText,
    loggedInUserId,
    selectedChatDetails,
  });

  const [readMore, setReadMore] = useState<boolean>(false);
  const isMessageLong = decryptedMessage.length > 500;
  const inEditState = editMessageId === messageId;

  return inEditState ? (
    <EditMessageForm
      messageId={messageId}
      prevContentValue={decryptedMessage}
      setEditMessageId={setEditMessageId}
      setOpenContextMenuMessageId={setOpenContextMenuMessageId}
    />
  ) : (
    <>
      <span className="break-words max-sm:text-sm">
        {readMore ? decryptedMessage : decryptedMessage.substring(0, 400)}
        {isMessageLong && (
          <span
            className="font-medium cursor-pointer"
            onClick={() => setReadMore(!readMore)}
          >
            {readMore ? " Read less" : " Read more"}...
          </span>
        )}
      </span>
    </>
  );
};
