"use client";
import { useHandleOutsideClick } from "@/hooks/useUtils/useHandleOutsideClick";
import { EmojiClickData } from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useEmitTypingEvent } from "../../hooks/useChat/useEmitTypingEvent";
import { useSendMessage } from "../../hooks/useMessages/useSendMessage";
import { useToggleGif } from "../../hooks/useUI/useToggleGif";
import { useTogglePoolForm } from "../../hooks/useUI/useTogglePoolForm";
import { useDebounce } from "../../hooks/useUtils/useDebounce";
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice";
import { useAppSelector } from "../../services/redux/store/hooks";
import { AttachmentFileInput } from "../attachments/AttachmentFileInput";
import { AttachmentUploadButton } from "../attachments/AttachmentUploadButton";
import { SelectedAttachmentsPreviewList } from "../attachments/SelectedAttachmentsPreviewList";
import { EmojiPickerForm } from "../emoji/EmojiPickerForm";
import { MessageInput } from "../ui/MessageInput";
import { PollingIcon } from "../ui/icons/PollingIcon";

export const MessageForm = () => {
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  const [selectedAttachments, setSelectedAttachments] = useState<Array<Blob>>(
    []
  );
  const [attachmentsPreview, setAttachmentsPreview] = useState<Array<string>>(
    []
  );

  const [attachmentsMenu, setAttachmentsMenu] = useState<boolean>(false);
  const [emojiForm, setEmojiForm] = useState<boolean>(false);

  const [messageVal, setMessageVal] = useState<string>("");

  const { toggleGifForm } = useToggleGif();
  const { togglePollForm } = useTogglePoolForm();

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useHandleOutsideClick(emojiPickerRef, () => setEmojiForm(false));

  useEffect(() => {
    if (selectedAttachments.length) {
      setAttachmentsPreview(
        selectedAttachments.map((attachment) => URL.createObjectURL(attachment))
      );
    }
    return () => {
      attachmentsPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedAttachments]);

  const isTyping = useDebounce(messageVal, 350);
  useEmitTypingEvent(isTyping);

  const { sendMessage } = useSendMessage();

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMessageVal("");
    if (messageVal.trim().length) {
      sendMessage(messageVal, undefined);
      setEmojiForm(false);
    }
  };

  const handleEmojiSelect = (e: EmojiClickData) => {
    setMessageVal((val) => val + e.emoji);
  };

  const handlePollClick = () => {
    setAttachmentsMenu(false);
    togglePollForm();
  };

  return (
    <form
      onSubmit={handleMessageSubmit}
      className="relative"
      autoComplete="off"
      aria-autocomplete="none"
    >
      {attachmentsPreview.length > 0 && (
        <div className="flex items-center flex-wrap gap-4 ml-auto w-fit">
          <SelectedAttachmentsPreviewList
            attachmentsPreview={attachmentsPreview}
            selectedAttachments={selectedAttachments}
            setAttachmentsPreview={setAttachmentsPreview}
            setSelectedAttachments={setSelectedAttachments}
          />
          <AttachmentUploadButton
            selectedAttachments={selectedAttachments}
            selectedChatDetails={selectedChatDetails}
            setAttachmentsPreview={setAttachmentsPreview}
            setSelectedAttachments={setSelectedAttachments}
          />
        </div>
      )}

      <AnimatePresence>
        {attachmentsMenu && (
          <motion.div
            variants={{
              hide: { y: 40, opacity: 0 },
              show: { y: 0, opacity: 1 },
            }}
            initial="hide"
            exit={"hide"}
            animate="show"
            className="bg-secondary-dark p-4 w-36 rounded-md absolute -top-28 right-0 flex justify-between"
          >
            <AttachmentFileInput
              setAttachmentsMenu={setAttachmentsMenu}
              setSelectedAttachments={setSelectedAttachments}
            />
            <div
              onClick={handlePollClick}
              className="flex flex-col items-center cursor-pointer"
            >
              <PollingIcon />
              <p className="text-text">Poll</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {emojiForm && (
          <motion.div
            ref={emojiPickerRef}
            variants={{
              hide: { y: 40, opacity: 0 },
              show: { y: 0, opacity: 1 },
            }}
            initial="hide"
            exit={"hide"}
            animate="show"
            className="absolute bottom-20 left-0"
          >
            <EmojiPickerForm onEmojiClick={handleEmojiSelect} />
          </motion.div>
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
