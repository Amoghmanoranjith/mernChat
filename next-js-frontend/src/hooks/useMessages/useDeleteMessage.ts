import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";

export const useDeleteMessage = () => {
  const socket = useSocket();
  const deleteMessage = ({ messageId }: { messageId: string }) => {
    socket?.emit(Event.MESSAGE_DELETE, { messageId });
  };
  return { deleteMessage };
};
