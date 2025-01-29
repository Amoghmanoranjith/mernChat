import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";

export const useDeleteReaction = () => {
  const socket = useSocket();

  const deleteReaction = ({
    chatId,
    messageId,
  }: {
    chatId: string;
    messageId: string;
  }) => {
    socket?.emit(Event.DELETE_REACTION, { chatId, messageId });
  };

  return {
    deleteReaction,
  };
};
