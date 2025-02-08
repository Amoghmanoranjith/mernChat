import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { selectLoggedInUser } from "@/lib/client/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

type MessageSeenEventReceivePayload = {
  user:{
      id:string
      username:string
      avatar:string
  },
  chatId:string,
  readAt:Date
}


export const useMessageSeenListener = () => {

  const dispatch = useAppDispatch();
  const loggedInUserId = useAppSelector(selectLoggedInUser)?.id;

  useSocketEvent(Event.MESSAGE_SEEN,({chatId,user}: MessageSeenEventReceivePayload) => {

      const isOwnMessageSeenUpdate = user.id === loggedInUserId;

      dispatch(
        chatApi.util.updateQueryData("getChats", undefined, (draft) => {
          const chat = draft.find((draft) => draft.id === chatId);
          if (chat && isOwnMessageSeenUpdate && chat.UnreadMessages.length > 0 && chat.UnreadMessages[0]?.count){
            chat.UnreadMessages[0].count = 0;
          } 
        })
      );
    }
  );
};
