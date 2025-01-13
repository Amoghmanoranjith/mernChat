import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { Message } from "@/interfaces/message.interface";
import { motion } from "framer-motion";
import { MessageReactionList } from "./MessageReactionList";

type PropTypes = {
  message: Message;
  loggedInUserId: string;
  selectedChatDetails: ChatWithUnreadMessages;
};

export const MessageReactionsInfo = ({
  loggedInUserId,
  message,
  selectedChatDetails,
}: PropTypes) => {
  const myMessage = loggedInUserId === message.sender._id;

  return (
    <motion.div
      variants={{ hide: { opacity: 0, y: 5 }, show: { opacity: 1, y: 0 } }}
      initial="hide"
      animate="show"
      className={`absolute bg-secondary-dark min-w-72 ${
        myMessage ? "right-0" : "left-0"
      } max-h-72 min-h-56  top-0 overflow-y-auto scroll-smooth p-4 rounded-md flex flex-col gap-y-4 z-10`}
    >
      <h4 className="text-lg">Reactions</h4>
      <MessageReactionList
        loggedInUserId={loggedInUserId}
        messageId={message._id}
        reactions={message.reactions}
        selectedChatDetails={selectedChatDetails}
      />
    </motion.div>
  );
};
