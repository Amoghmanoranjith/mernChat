import { getSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";

export const useDeleteMessage = () => {
  const socket = getSocket();
  const deleteMessage = ({ messageId }: { messageId: string }) => {
    socket?.emit(Event.MESSAGE_DELETE, { messageId });
  };
  return { deleteMessage };
};
