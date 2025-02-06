import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import {
  VoteInEventPayloadData,
  VoteOutEventPayloadData,
} from "@/interfaces/message.interface";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { useAppSelector } from "@/lib/client/store/hooks";

export const useVoteOut = () => {
  const socket = useSocket();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  const handleVoteOut = ({
    messageId,
    optionIndex,
  }: Pick<VoteInEventPayloadData, "messageId" | "optionIndex">) => {
    if (selectedChatDetails) {
      const payload: VoteOutEventPayloadData = {
        chatId: selectedChatDetails._id,
        messageId,
        optionIndex,
      };
      socket?.emit(Event.VOTE_OUT, payload);
    }
  };

  return { handleVoteOut };
};
