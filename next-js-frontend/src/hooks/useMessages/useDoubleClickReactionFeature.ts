import { Message } from "@/interfaces/message.interface";
import { useDeleteReaction } from "./useDeleteReaction";
import { useSendNewReaction } from "./useSendNewReaction";

type PropTypes = {
  chatId: string;
  messageId: string;
  reactions: Message["reactions"];
  loggedInUserId: string;
};

export const useDoubleClickReactionFeature = ({
  chatId,
  loggedInUserId,
  messageId,
  reactions,
}: PropTypes) => {
  const { deleteReaction } = useDeleteReaction();
  const { sendNewReaction } = useSendNewReaction();

  const handleDoubleClick = () => {
    const userReaction = reactions.find(
      (reaction) => reaction?.user?._id === loggedInUserId
    );

    if (userReaction?.emoji !== "❤️") {
      deleteReaction({ chatId, messageId });
      sendNewReaction({ chatId, messageId, reaction: "❤️" });
    } else if (userReaction.emoji === "❤️") {
      deleteReaction({ chatId, messageId });
    } else {
      sendNewReaction({ chatId, messageId, reaction: "❤️" });
    }
  };

  return { handleDoubleClick };
};
