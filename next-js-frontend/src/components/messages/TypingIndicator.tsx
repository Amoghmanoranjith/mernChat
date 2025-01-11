import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { TypingIndicatorWithUserList } from "../chat/TypingIndicatorWithUserList";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";

type PropTypes = {
  selectedChatDetails: ChatWithUnreadMessages;
  isNearBottom: boolean;
};

export const TypingIndicator = ({
  selectedChatDetails,
  isNearBottom,
}: PropTypes) => {
  return (
    <AnimatePresence>
      {isNearBottom && selectedChatDetails.userTyping.length && (
        <motion.div
          className="w-fit"
          variants={{
            hide: { opacity: 0, x: -10 },
            show: { opacity: 1, x: 0 },
          }}
          initial="hide"
          animate="show"
          exit="hide"
        >
          <TypingIndicatorWithUserList
            isGroupChat={selectedChatDetails.isGroupChat}
            users={selectedChatDetails.userTyping}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
