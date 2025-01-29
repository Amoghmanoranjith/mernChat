import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import { NewReactionEventPayloadData } from "@/interfaces/message.interface";

export const useSendNewReaction = () => {
  const socket = useSocket();

  const sendNewReaction = ({
    chatId,
    messageId,
    reaction,
  }: NewReactionEventPayloadData) => {
    socket?.emit(Event.NEW_REACTION, { chatId, messageId, reaction });
  };

  return {
    sendNewReaction,
  };
};
