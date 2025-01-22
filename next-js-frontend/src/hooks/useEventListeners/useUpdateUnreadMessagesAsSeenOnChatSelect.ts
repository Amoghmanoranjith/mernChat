import { Event } from "@/interfaces/events.interface";
import { Message } from "@/interfaces/message.interface";
import { messageApi } from "@/services/api/message.api";
import { useAppDispatch } from "@/services/redux/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";
import { chatApi } from "@/services/api/chat.api";

export const useMessageListener = () => {
  const dispatch = useAppDispatch();

  useSocketEvent(Event.MESSAGE, async (newMessage: Message) => {
    
    dispatch(
      messageApi.util.updateQueryData("getMessagesByChatId",{ chatId: newMessage.chat, page: 1 },(draft) => {
          draft.messages.push(newMessage);
          if (!draft.totalPages) draft.totalPages = 1;
        }
      )
    );

    dispatch(
      chatApi.util.updateQueryData("getChats",undefined,(draft)=>{
        const chat = draft.find(draft=>draft._id===newMessage.chat);

        if(chat){
          chat.latestMessage=newMessage
        }
      })
    )
  });
};
