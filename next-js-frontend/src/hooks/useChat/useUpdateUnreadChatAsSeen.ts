import { getSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import { MessageSeenEventPayloadData } from "@/interfaces/message.interface";
import { useGetChatsQuery } from "@/services/api/chat.api";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import { useEffect } from "react";

export const useUpdateUnreadChatAsSeen = () => {
  const socket = getSocket();
  const selectedChatId = useAppSelector(selectSelectedChatDetails)?._id;

  const { data: chatData } = useGetChatsQuery();

  useEffect(() => {
    if (selectedChatId && chatData) {
      const chat = chatData.find((chat) => chat._id === selectedChatId);

      if (chat && chat.unreadMessages.count > 0) {
        const data: MessageSeenEventPayloadData = {
          chatId: selectedChatId,
        };

        socket?.emit(Event.MESSAGE_SEEN, data);
      }
    }
  }, [selectedChatId, chatData]);
};
