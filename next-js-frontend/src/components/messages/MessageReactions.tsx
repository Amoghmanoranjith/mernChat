import { Message } from "@/interfaces/message.interface";
import { motion } from "framer-motion";

type PropTypes = {
  message: Message;
  setReactionMenuMessageId: (messageId: string) => void;
};

export const MessageReactions = ({
  message,
  setReactionMenuMessageId,
}: PropTypes) => {
  return (
    <div
      onClick={() => setReactionMenuMessageId(message._id)}
      className="bg-secondary-dark self-end px-1 rounded-lg flex items-center -mt-1 cursor-pointer"
    >
      {message.reactions.slice(0, 4).map((reaction,index) => (
        <motion.p
          key={index}
          variants={{
            hide: { opacity: 0, y: 10, scale: 1.5 },
            show: { opacity: 1, y: 0, scale: 1 },
          }}
          initial="hide"
          animate="show"
        >
          {reaction.emoji}
        </motion.p>
      ))}

      {message.reactions.length > 4 && (
        <span className="rounded-full">+{message.reactions.length - 4}</span>
      )}
    </div>
  );
};
