import { getSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import { VoteInEventPayloadData } from "@/interfaces/message.interface";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";


export const useVoteIn = () => {
  const socket = getSocket();
  const selectedChatDetails =  useAppSelector(selectSelectedChatDetails);

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
