import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { friendApi } from "@/lib/client/rtk-query/friend.api";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";


type OfflineUserEventReceivePayload = {
  userId:string
}

export const useOfflineUserListener = () => {

  const dispatch = useAppDispatch();

  useSocketEvent(Event.OFFLINE_USER, ({userId}:OfflineUserEventReceivePayload) => {

    dispatch(
      friendApi.util.updateQueryData("getFriends", undefined, (draft) => {
        const friend = draft.find((draft) => draft.id === userId);
        if (friend) friend.isOnline = false;
      })
    );

    dispatch(
      chatApi.util.updateQueryData("getChats", undefined, (draft) => {
        draft.map(chat => {
          const user = chat.ChatMembers.find(member => member.user.id === userId);
          if (user)  user.user.isOnline = false;
        });
      })
    );
  });
};
