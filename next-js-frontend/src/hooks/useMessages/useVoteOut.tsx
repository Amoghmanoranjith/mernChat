import { getSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import {
  VoteInEventPayloadData,
  VoteOutEventPayloadData,
} from "@/interfaces/message.interface";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";

export const useVoteOut = () => {
  const socket = getSocket();
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
