import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import { VoteInEventPayloadData } from "@/interfaces/message.interface";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { useAppSelector } from "@/lib/client/store/hooks";

export const useVoteIn = () => {
  const socket = useSocket();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  const handleVoteIn = ({
    messageId,
    optionIndex,
  }: Pick<VoteInEventPayloadData, "messageId" | "optionIndex">) => {
    if (selectedChatDetails) {
      const payload: VoteInEventPayloadData = {
        chatId: selectedChatDetails._id,
        messageId,
        optionIndex,
      };
      socket?.emit(Event.VOTE_IN, payload);
    }
  };

  return { handleVoteIn };
};
