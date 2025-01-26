import { useDeleteMessage } from "@/hooks/useMessages/useDeleteMessage";
import { EmojiClickData } from "emoji-picker-react";
import { motion } from "framer-motion";
import { ContextMenuList } from "../contextMenu/ContextMenuList";
import { EmojiPickerForm } from "../emoji/EmojiPickerForm";
import { DeleteIcon } from "../ui/icons/DeleteIcon";
import { EditIcon } from "../ui/icons/EditIcon";

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
  const { deleteMessage } = useDeleteMessage();

  const contextOptions = [
    {
      name: "Edit",
      icon: <EditIcon />,
      handlerFunc: () => {
        setOpenContextMenuMessageId(undefined);
        setEditMessageId(messageId);
      },
    },
    {
      name: "Unsend",
      icon: <DeleteIcon />,
      handlerFunc: () => deleteMessage({ messageId }),
    },
  ];

  return (
    <motion.div
      variants={{ hide: { opacity: 0 }, show: { opacity: 1 } }}
      initial="hide"
      animate="show"
      className={`flex flex-col gap-y-2 absolute ${
        myMessage ? "right-0" : "left-0"
      } z-10`}
    >
      <div>
        <EmojiPickerForm
          onEmojiClick={onEmojiClick}
          reactionsDefaultOpen={true}
        />
      </div>

      {myMessage && (
        <div
          className={`flex flex-col bg-secondary-dark text-text p-2 rounded-2xl shadow-2xl min-w-32 self-end`}
        >
          <ContextMenuList contextOptions={contextOptions} />
        </div>
      )}
    </motion.div>
  );
};
