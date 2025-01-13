import { useHandleOutsideClick } from "@/hooks/useUtils/useHandleOutsideClick";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useRef } from "react";
import { EmojiPickerForm } from "../emoji/EmojiPickerForm";

type PropTypes = {
  setEmojiForm: Dispatch<SetStateAction<boolean>>;
  setMessageVal: Dispatch<SetStateAction<string>>;
};

export const MessageInputAreaEmojiSelector = ({
  setEmojiForm,
  setMessageVal,
}: PropTypes) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  useHandleOutsideClick(emojiPickerRef, () => setEmojiForm(false));

  return (
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
      <EmojiPickerForm
        onEmojiClick={(e) => setMessageVal((val) => val + e.emoji)}
      />
    </motion.div>
  );
};
