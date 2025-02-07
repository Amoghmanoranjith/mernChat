import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { friendApi } from "@/lib/client/rtk-query/friend.api";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

type OnlineUsersListEventReceivePayload = {
  onlineUserIds:string[]
}

export const useOnlineUsersListListener = () => {

  const dispatch = useAppDispatch();

  useSocketEvent(Event.ONLINE_USERS_LIST, ({onlineUserIds}:OnlineUsersListEventReceivePayload) => {

    dispatch(
      friendApi.util.updateQueryData("getFriends", undefined, (draft) => {
        draft.forEach(friend => {
          friend.isOnline = onlineUserIds.includes(friend.id);
        });
      })
    );

    dispatch(
      chatApi.util.updateQueryData("getChats", undefined, (draft) => {
        draft.forEach(chat => {
          chat.ChatMembers.forEach(member => {
            member.user.isOnline = onlineUserIds.includes(member.user.id);
          });
        });
      })
    );
  });
};
