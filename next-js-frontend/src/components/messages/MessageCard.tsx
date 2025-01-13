import { useCloseReactionsMenuWhenZeroReactions } from "@/hooks/useMessages/useCloseReactionsMenuWhenZeroReactions";
import { useEmojiClickReactionFeature } from "@/hooks/useMessages/useEmojiClickReactionFeature";
import { useHandleContextMenuClick } from "@/hooks/useMessages/useHandleContextMenuClick";
import { useHandleOutsideClick } from "@/hooks/useUtils/useHandleOutsideClick";
import type { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import type { Message } from "@/interfaces/message.interface";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ContextMenu } from "../shared/ContextMenu";
import { MessageDisplay } from "./MessageDisplay";
import { MessageReactionsInfo } from "./MessageReactionsInfo";
import { MessageReactions } from "./MessageReactions";

type PropTypes = {
  editMessageId: string | undefined;
  message: Message;
  loggedInUserId: string;
  selectedChatDetails: ChatWithUnreadMessages;
  reactionMenuMessageId: string | undefined;
  openContextMenuMessageId: string | undefined;
  setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpenContextMenuMessageId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setReactionMenuMessageId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

export const MessageCard = ({
  message,
  openContextMenuMessageId,
  reactionMenuMessageId,
  selectedChatDetails,
  loggedInUserId,
  editMessageId,
  setReactionMenuMessageId,
  setOpenContextMenuMessageId,
  setEditMessageId,
}: PropTypes) => {
  const reactionsRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useHandleOutsideClick(reactionsRef, () =>
    setReactionMenuMessageId(undefined)
  );
  useHandleOutsideClick(contextMenuRef, () =>
    setOpenContextMenuMessageId(undefined)
  );
  useCloseReactionsMenuWhenZeroReactions(message, setReactionMenuMessageId);

  const { handleContextMenuClick } = useHandleContextMenuClick({
    messageId: message._id,
    openContextMenuMessageId,
    setOpenContextMenuMessageId,
  });

  const { handleEmojiClick } = useEmojiClickReactionFeature({
    chatId: selectedChatDetails._id,
    loggedInUserId,
    messageId: message._id,
    message,
    setOpenContextMenuMessageId,
  });

  const myMessage = message.sender._id === loggedInUserId;
  const isContextMenuOpen = openContextMenuMessageId === message._id;
  const isReactionMenuOpen = reactionMenuMessageId === message._id;
  const messageHasReactions =
    message?.reactions && message.reactions.length > 0;

  return (
    <motion.div
      initial={{ x: -2 }}
      animate={{ x: 0 }}
      className={`flex gap-x-2 ${
        myMessage ? "self-end" : ""
      } text-text relative `}
      onContextMenu={(e) => handleContextMenuClick(e)}
    >
      {isContextMenuOpen && (
        <ContextMenu
          messageId={message._id}
          setEditMessageId={setEditMessageId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
          onEmojiClick={handleEmojiClick}
        />
      )}
      {!myMessage && (
        <Image
          className="aspect-square object-cover w-12 self-end rounded-full max-lg:w-10 max-sm:w-8"
          src={message.sender.avatar}
          alt={`${message.sender.username}-profile-pic`}
          width={100}
          height={100}
        />
      )}

      <div className="flex flex-col">
        <MessageDisplay
          editMessageId={editMessageId}
          isContextMenuOpen={isContextMenuOpen}
          loggedInUserId={loggedInUserId}
          message={message}
          myMessage={myMessage}
          selectedChatDetails={selectedChatDetails}
          setEditMessageId={setEditMessageId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
        />

        {messageHasReactions && (
          <MessageReactions
            message={message}
            setReactionMenuMessageId={setReactionMenuMessageId}
          />
        )}

        {isReactionMenuOpen && messageHasReactions && (
          <MessageReactionsInfo
            loggedInUserId={loggedInUserId}
            message={message}
            selectedChatDetails={selectedChatDetails}
          />
        )}
      </div>
    </motion.div>
  );
};
