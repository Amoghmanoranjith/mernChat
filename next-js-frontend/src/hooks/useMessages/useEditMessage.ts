import { getSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import type { EditMessageEventPayloadData } from "@/interfaces/message.interface";
import { selectLoggedInUser } from "../../services/redux/slices/authSlice";
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice";
import { useAppSelector } from "../../services/redux/store/hooks";
import { encryptMessage } from "../../utils/encryption";
import { useGetSharedKey } from "../useAuth/useGetSharedKey";

export const useEditMessage = () => {
  const socket = getSocket();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id;

  const { getSharedKey } = useGetSharedKey();

  const editMessage = async (messageId: string, updatedContent: string) => {
    if (selectedChatDetails && loggedInUserId) {
      let encryptedMessage;

      if (!selectedChatDetails.isGroupChat) {
        const otherMember = selectedChatDetails.members.filter(
          (member) => member._id !== loggedInUserId
        )[0];

        const sharedKey = await getSharedKey({loggedInUserId,otherMember});

        if (sharedKey) {
          encryptedMessage = await encryptMessage({message:updatedContent,sharedKey});
        }
      }

      const payload: EditMessageEventPayloadData = {
        chatId: selectedChatDetails._id,
        messageId: messageId,
        updatedContent: encryptedMessage ? encryptedMessage : updatedContent,
      };

      socket?.emit(Event.MESSAGE_EDIT, payload);
    }
  };

  return { editMessage };
};
