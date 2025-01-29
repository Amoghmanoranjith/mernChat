import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import type { MessageEventPayloadData } from "@/interfaces/message.interface";
import { getOtherMemberOfPrivateChat } from "@/utils/helpers";
import { selectLoggedInUser } from "../../services/redux/slices/authSlice";
import { selectSelectedChatDetails } from "../../services/redux/slices/chatSlice";
import { useAppSelector } from "../../services/redux/store/hooks";
import { encryptMessage } from "../../utils/encryption";
import { useGetSharedKey } from "../useAuth/useGetSharedKey";

export const useSendMessage = () => {
  const socket = useSocket();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  const loggedInUserId = useAppSelector(selectLoggedInUser)?._id;
  const { getSharedKey } = useGetSharedKey();

  const sendMessage = async (
    messageVal?: string,
    url?: string,
    pollQuestion?: string,
    pollOptions?: Array<string>,
    isMultipleAnswers?: boolean
  ) => {
    let encryptedMessage;

    if (
      messageVal &&
      loggedInUserId &&
      !selectedChatDetails?.isGroupChat &&
      selectedChatDetails
    ) {
      // if we are trying to send a message in a private chat, we need to encrypt it

      const otherMember = getOtherMemberOfPrivateChat(
        selectedChatDetails,
        loggedInUserId
      );
      const sharedSecretKey = await getSharedKey({
        loggedInUserId,
        otherMember,
      });

      if (sharedSecretKey) {
        encryptedMessage = await encryptMessage({
          message: messageVal,
          sharedKey: sharedSecretKey,
        });
      }
    }

    if (
      selectedChatDetails &&
      (messageVal || url || pollOptions || pollQuestion || isMultipleAnswers)
    ) {
      // if we are trying to send a message in a group chat, we need to send the message as it is
      // because group chat messages are not encrypted
      const newMessage: MessageEventPayloadData = {
        chat: selectedChatDetails._id,
        content: encryptedMessage
          ? encryptedMessage
          : messageVal
          ? messageVal
          : undefined,
        url: url ? url : undefined,
        isPoll: pollOptions?.length && pollQuestion?.length ? true : undefined,
        pollOptions: pollOptions?.map((option) => {
          return { option, votes: [] };
        }),
        pollQuestion,
        isMultipleAnswers,
      };
      socket?.emit(Event.MESSAGE, newMessage);
    }
  };

  return { sendMessage };
};
