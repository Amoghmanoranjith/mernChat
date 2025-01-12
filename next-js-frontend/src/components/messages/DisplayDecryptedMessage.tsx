import { useDecryptMessage } from "@/hooks/useUtils/useDecryptMessage";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { selectLoggedInUser } from "@/services/redux/slices/authSlice";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";

type PropTypes = {
    cipherText: string;
}

export const DisplayDecryptedMessage = ({cipherText}:PropTypes) => {

    const loggedInUserId = useAppSelector(selectLoggedInUser)?._id as string;
    const selectedChatDetails = useAppSelector(selectSelectedChatDetails) as ChatWithUnreadMessages;
    const {decryptedMessage}=useDecryptMessage({cipherText,loggedInUserId,selectedChatDetails})

  return (
    <span>{decryptedMessage}</span>
  )
}
