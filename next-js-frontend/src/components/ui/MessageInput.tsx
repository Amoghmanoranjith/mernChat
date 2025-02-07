"use client";
import { motion } from "framer-motion";
import { useDynamicRowValue } from "../../hooks/useUtils/useDynamicRowValue";
import { MessageInputExtraOptions } from "../messages/MessageInputExtraOptions";
import { SendIcon } from "./icons/SendIcon";
import { SmileIcon } from "./icons/SmileIcon";

type PropTypes = {
  messageVal: string;
  setMessageVal: React.Dispatch<React.SetStateAction<string>>;
  toggleGif: () => void;
  toggleAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  toggleEmojiForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const MessageInput = ({
  messageVal,
  setMessageVal,
  toggleGif,
  toggleAttachmentsMenu,
  toggleEmojiForm,
}: PropTypes) => {
  
  const { getRowValue } = useDynamicRowValue();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if the 'Enter' key was pressed without the 'Shift' key
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default action of the 'Enter' key (which is usually inserting a newline in the text area)

      // Find the closest form element
      const form = e.currentTarget.closest("form");

      // If a form element is found, dispatch a submit event to trigger form submission
      if (form)
        form.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
    }
  };

  return (
    <div className="flex rounded-xl text-text items-center bg-secondary">

      <button type="button" onClick={toggleEmojiForm}>
        <SmileIcon />
      </button>

      <textarea
        value={messageVal}
        onChange={(e) => setMessageVal(e.target.value)}
        className="px-3 py-5 bg-secondary outline-none rounded-sm w-full max-sm:text-sm resize-none scroll-smooth"
        aria-autocomplete="none"
        style={{ scrollbarWidth: "none" }}
        autoComplete="off"
        placeholder="Your message"
        name="chatMessageBaatchit"
        inputMode="text"
        id="message-input"
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="none"
        maxLength={1000}
        rows={getRowValue(messageVal.length)}
        onKeyDown={handleKeyDown}
      />

      {!messageVal.trim() && (
        <MessageInputExtraOptions
          toggleAttachmentsMenu={toggleAttachmentsMenu}
          toggleGif={toggleGif}
        />
      )}

      {messageVal.trim().length>0 && (
        <motion.button
          onMouseDown={(e) => e.preventDefault()}
          initial={{ x: 5, opacity: 0, position: "fixed" }}
          animate={{ x: 0, opacity: 1, position: "static" }}
          type="submit"
          className="bg-primary-dark p-2 hover:bg-transparent transition-colors rounded-full"
        >
          <SendIcon />
        </motion.button>
      )}

    </div>
  );
};
