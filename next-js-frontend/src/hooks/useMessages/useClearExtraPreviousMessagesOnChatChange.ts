import { messageApi } from "@/services/api/message.api";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";
import { useEffect } from "react";


export const useClearExtraPreviousMessagesOnChatChange = () => {

    const selectedChatId =  useAppSelector(selectSelectedChatDetails)?._id;
    const dispatch = useAppDispatch();

    const clearExtraPreviousMessages = (chatId: string) => {

        // Dispatch an action to update the query data for fetching messages for the current chat
        dispatch(
          messageApi.util.updateQueryData("getMessagesByChatId", { chatId, page: 1 }, (draft) => {
            
            // Define an array to store the messages that should be kept
            let messagesToKeep = [];
    
            // Filter messages to keep only those that are marked as new
            const newMessages = draft.messages.filter(message => message?.isNew);
    
            // If the number of new messages exceeds 20, only keep the last 20 messages
            if (newMessages.length > 20) {
              messagesToKeep = draft.messages.slice(-20); // Take the last 20 messages
            } else {
              // Otherwise, calculate the difference and keep the remaining messages
              const difference = 20 - newMessages.length;
              messagesToKeep = [
                ...draft.messages.slice(0, difference), // Keep the first 'difference' messages
                ...newMessages // Add the new messages at the end
              ];
            }
    
            // Update the draft of messages to only contain the relevant messages to keep
            draft.messages = messagesToKeep;
          })
        );
      }

    useEffect(()=>{
        return ()=>{
            if(selectedChatId){
                clearExtraPreviousMessages(selectedChatId)
            }
        }
    },[selectedChatId])
}
