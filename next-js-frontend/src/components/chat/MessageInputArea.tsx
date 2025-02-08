"use client";
import { useGenerateAttachmentsPreview } from "@/hooks/useAttachment/useGenerateAttachmentsPreview";
import { useHandleUploadAttachment } from "@/hooks/useAttachment/useHandleUploadAttachment";
import { useHandleSendMessage } from "@/hooks/useMessages/useHandleSendMessage";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useEmitTypingEvent } from "../../hooks/useChat/useEmitTypingEvent";
import { useDebounce } from "../../hooks/useUtils/useDebounce";
import { AttachmentMenu } from "../attachments/AttachmentMenu";
import { SelectedAttachmentsPreviewList } from "../attachments/SelectedAttachmentsPreviewList";
import { EmojiSelector } from "../messages/EmojiSelector";
import { MessageInput } from "../ui/MessageInput";
import { UploadIcon } from "../ui/icons/UploadIcon";

type PropTypes = {
  selectedChatDetails: fetchUserChatsResponse;
};
export const MessageInputArea = ({ selectedChatDetails }: PropTypes) => {
  
  const [selectedAttachments, setSelectedAttachments] = useState<Blob[]>([]);
  const { attachmentsPreview } = useGenerateAttachmentsPreview({selectedAttachments});

  const [attachmentsMenuOpen, setAttachmentsMenuOpen] = useState<boolean>(false);
  const [emojiFormOpen, setEmojiFormOpen] = useState<boolean>(false);

  const [messageVal, setMessageVal] = useState<string>("");

  const isTyping = useDebounce(messageVal, 200);
  useEmitTypingEvent(isTyping);

  const { handleMessageSubmit } = useHandleSendMessage({
    messageVal,
    setMessageVal,
  });

  const {handleUploadAttachments} = useHandleUploadAttachment({selectedAttachments,selectedChatDetails,setSelectedAttachments});

  return (
    <form
      onSubmit={handleMessageSubmit}
      className="relative"
      autoComplete="off"
    >
      {attachmentsPreview.length > 0 && (
        <div className="flex items-center flex-wrap gap-4 ml-auto w-fit">
            <SelectedAttachmentsPreviewList
              attachmentsPreview={attachmentsPreview}
              selectedAttachments={selectedAttachments}
              setSelectedAttachments={setSelectedAttachments}
            />
          <motion.button
            type="button"
            onClick={handleUploadAttachments}
            className="p-4 bg-primary text-white rounded-full shadow-xl"
          >
            <UploadIcon/>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {attachmentsMenuOpen && (
          <AttachmentMenu
            setAttachmentsMenuOpen={setAttachmentsMenuOpen}
            setSelectedAttachments={setSelectedAttachments}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {emojiFormOpen && (
          <EmojiSelector
            setEmojiFormOpen={setEmojiFormOpen}
            setMessageVal={setMessageVal}
          />
        )}
      </AnimatePresence>

      <MessageInput
        messageVal={messageVal}
        setMessageVal={setMessageVal}
        setAttachmentsMenuOpen={setAttachmentsMenuOpen}
        setEmojiFormOpen={setEmojiFormOpen}
      />
    </form>
  );
};
