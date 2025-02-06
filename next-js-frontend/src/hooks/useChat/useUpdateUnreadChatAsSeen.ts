import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import { MessageSeenEventPayloadData } from "@/interfaces/message.interface";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { useAppSelector } from "@/lib/client/store/hooks";
import { useEffect } from "react";

export const useUpdateUnreadMessagesAsSeenOnChatSelect = () => {
  const socket = useSocket();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  useEffect(() => {
    if (selectedChatDetails && selectedChatDetails.unreadMessages.count > 0) {
      const payload: MessageSeenEventPayloadData = {
        chatId: selectedChatDetails._id,
      };
      socket?.emit(Event.MESSAGE_SEEN, payload);
    }
  }, [selectedChatDetails, socket]);
};
