import { EmojiClickData } from "emoji-picker-react";
import { motion } from "framer-motion";
import { EmojiPickerForm } from "../emoji/EmojiPickerForm";
import { ContextMenuOptions } from "./ContextMenuOptions";

type PropTypes = {
  onEmojiClick: (e: EmojiClickData) => void | null;
  setOpenContextMenuMessageId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>;
  messageId: string;
  myMessage: boolean;
};

export const ContextMenu = ({
  setOpenContextMenuMessageId,
  setEditMessageId,
  onEmojiClick,
  messageId,
  myMessage,
}: PropTypes) => {
  return (
    <motion.div
      variants={{ hide: { opacity: 0 }, show: { opacity: 1 } }}
      initial="hide"
      animate="show"
      className={`flex flex-col gap-y-2 absolute ${
        myMessage ? "right-0" : "left-0"
      } z-10`}
    >
      <EmojiPickerForm
        onEmojiClick={onEmojiClick}
        reactionsDefaultOpen={true}
      />
      {myMessage && (
        <ContextMenuOptions
          messageId={messageId}
          setEditMessageId={setEditMessageId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
        />
      )}
    </motion.div>
  );
};
