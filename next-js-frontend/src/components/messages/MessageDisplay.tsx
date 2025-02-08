import { useDoubleClickReactionFeature } from "@/hooks/useMessages/useDoubleClickReactionFeature";
import { Message } from "@/interfaces/message.interface";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import { RenderAppropriateMessage } from "./RenderAppropriateMessage";

type PropTypes = {
  isContextMenuOpen: boolean;
  myMessage: boolean;
  editMessageId: string | undefined;
  loggedInUserId: string;
  selectedChatDetails: fetchUserChatsResponse;
  message: Message;
  setEditMessageId: Dispatch<SetStateAction<string | undefined>>;
  setOpenContextMenuMessageId: Dispatch<SetStateAction<string | undefined>>;
};

export const MessageDisplay = ({
  isContextMenuOpen,
  myMessage,
  editMessageId,
  loggedInUserId,
  selectedChatDetails,
  message,
  setEditMessageId,
  setOpenContextMenuMessageId,
}: PropTypes) => {
  const { handleDoubleClick } = useDoubleClickReactionFeature({
    chatId: selectedChatDetails.id,
    loggedInUserId,
    messageId: message.id,
    reactions: message.reactions,
  });

  return (
    <motion.div
      whileTap={{ scale: message.isPollMessage ? 1 : 0.98 }}
      onDoubleClick={handleDoubleClick}
      className={`${myMessage ? "bg-primary text-white" : "bg-secondary-dark"} ${isContextMenuOpen? "border-2 border-double border-spacing-4 border-": null} max-w-96 min-w-10 rounded-2xl px-4 py-2 flex flex-col gap-y-1 justify-center max-md:max-w-80 max-sm:max-w-64`}
    >
      <RenderAppropriateMessage
        editMessageId={editMessageId}
        loggedInUserId={loggedInUserId}
        selectedChatDetails={selectedChatDetails}
        message={message}
        setEditMessageId={setEditMessageId}
        setOpenContextMenuMessageId={setOpenContextMenuMessageId}
      />
      <div className="flex items-center ml-auto gap-x-1 flex-nowrap shrink-0">
        {message.isEdited && 
          <p className="text-secondary font-medim text-sm max-sm:text-xs">
            Edited
          </p>
        }
        <p className={`text-xs ${myMessage ? "text-gray-200" : "text-secondary-darker"}`}>
          {format(message.createdAt, "h:mm a").toLowerCase()}
        </p>
      </div>
    </motion.div>
  );
};
