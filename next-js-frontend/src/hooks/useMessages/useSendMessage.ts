import { useSocket } from "@/context/socket.context";
import { Event } from "@/interfaces/events.interface";
import { getOtherMemberOfPrivateChat } from "@/lib/shared/helpers";
import { encryptMessage } from "../../lib/client/encryption";
import { selectLoggedInUser } from "../../lib/client/slices/authSlice";
import { selectSelectedChatDetails } from "../../lib/client/slices/chatSlice";
import { useAppSelector } from "../../lib/client/store/hooks";
import { useGetSharedKey } from "../useAuth/useGetSharedKey";

interface MessageEventSendPayload {
  chatId:string
  isPollMessage:boolean
  textMessageContent?:string | ArrayBuffer
  url?:string
  pollData?:{
      pollQuestion?:string
      pollOptions?:string[]
      isMultipleAnswers?:boolean
  }
}

export const useSendMessage = () => {

  const socket = useSocket();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);
  const loggedInUserId = useAppSelector(selectLoggedInUser)?.id;
  const { getSharedKey } = useGetSharedKey();

  const sendMessage = async (messageVal?: string, url?: string, pollQuestion?: string, pollOptions?: Array<string>, isMultipleAnswers?: boolean ) => {

    let encryptedMessage;

    if (messageVal && loggedInUserId && selectedChatDetails && !selectedChatDetails?.isGroupChat) {

      // if we are trying to send a message in a private chat, we need to encrypt it
      const otherMember = getOtherMemberOfPrivateChat(
        selectedChatDetails,
        loggedInUserId
      ).user;

      const sharedSecretKey = await getSharedKey({
        loggedInUserId,
        otherMember,
      });
      
      if(sharedSecretKey) encryptedMessage = await encryptMessage({message: messageVal,sharedKey: sharedSecretKey});
    }

    if(selectedChatDetails && (messageVal || url || pollOptions || pollQuestion || isMultipleAnswers)) {
      // if we are trying to send a message in a group chat, we need to send the message as it is
      // because group chat messages are not encrypted
      const newMessage: MessageEventSendPayload = {
        chatId:selectedChatDetails.id,
        isPollMessage: pollOptions?.length && pollQuestion?.length ? true : false,
        textMessageContent: encryptedMessage ? encryptedMessage : messageVal? messageVal : undefined,
        url: url ? url : undefined,
        pollData:{
          isMultipleAnswers,
          pollOptions,
          pollQuestion
        }
      };
      socket?.emit(Event.MESSAGE, newMessage);
    }
  };

  return { sendMessage };
};
