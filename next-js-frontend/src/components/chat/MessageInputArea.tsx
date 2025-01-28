"use client";
import { useGenerateAttachmentsPreview } from "@/hooks/useAttachment/useGenerateAttachmentsPreview";
import { useHandleSendMessage } from "@/hooks/useMessages/useHandleSendMessage";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useEmitTypingEvent } from "../../hooks/useChat/useEmitTypingEvent";
import { useToggleGif } from "../../hooks/useUI/useToggleGif";
import { useDebounce } from "../../hooks/useUtils/useDebounce";
import { AttachmentPreviewListAndUploadButton } from "../attachments/AttachmentPreviewListAndUploadButton";
import { AttachmentSelectionMenu } from "../attachments/AttachmentSelectionMenu";
import { MessageInputAreaEmojiSelector } from "../messages/MessageInputAreaEmojiSelector";
import { MessageInput } from "../ui/MessageInput";

type PropTypes = {
  selectedChatDetails: ChatWithUnreadMessages;
};
export const MessageInputArea = ({ selectedChatDetails }: PropTypes) => {
  const [selectedAttachments, setSelectedAttachments] = useState<Blob[]>([]);
  const { attachmentsPreview } = useGenerateAttachmentsPreview({selectedAttachments});

  const [attachmentsMenu, setAttachmentsMenu] = useState<boolean>(false);
  const [emojiForm, setEmojiForm] = useState<boolean>(false);

  const [messageVal, setMessageVal] = useState<string>("");

  const { toggleGifForm } = useToggleGif();

  const isTyping = useDebounce(messageVal, 200);
  useEmitTypingEvent(isTyping);

  const { handleMessageSubmit } = useHandleSendMessage({
    messageVal,
    setMessageVal,
  });

  return (
    <form
      onSubmit={handleMessageSubmit}
      className="relative"
      autoComplete="off"
      aria-autocomplete="none"
    >
      {attachmentsPreview.length > 0 && (
        <AttachmentPreviewListAndUploadButton
          attachmentsPreview={attachmentsPreview}
          selectedAttachments={selectedAttachments}
          selectedChatDetails={selectedChatDetails}
          setSelectedAttachments={setSelectedAttachments}
        />
      )}

      <AnimatePresence>
        {attachmentsMenu && (
          <AttachmentSelectionMenu
            setAttachmentsMenu={setAttachmentsMenu}
            setSelectedAttachments={setSelectedAttachments}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {emojiForm && (
          <MessageInputAreaEmojiSelector
            setEmojiForm={setEmojiForm}
            setMessageVal={setMessageVal}
          />
        )}
      </AnimatePresence>

      <MessageInput
        toggleGif={toggleGifForm}
        messageVal={messageVal}
        setMessageVal={setMessageVal}
        toggleAttachmentsMenu={setAttachmentsMenu}
        toggleEmojiForm={(
          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
          e.stopPropagation();
          e.preventDefault();
          setEmojiForm((prev) => !prev);
        }}
      />
    </form>
  );
};
