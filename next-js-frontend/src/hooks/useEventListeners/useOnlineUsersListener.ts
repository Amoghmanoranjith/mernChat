import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { friendApi } from "@/lib/client/rtk-query/friend.api";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useOnlineUsersListener = () => {
  const dispatch = useAppDispatch();

  useSocketEvent(Event.ONLINE_USERS, (onlineUserIds: Array<string>) => {
    dispatch(
      friendApi.util.updateQueryData("getFriends", undefined, (draft) => {
        draft.forEach((friend) => {
          friend.isActive = onlineUserIds.includes(friend._id);
        });
      })
    );

    dispatch(
      chatApi.util.updateQueryData("getChats", undefined, (draft) => {
        draft.forEach((chat) => {
          chat.members.forEach((member) => {
            member.isActive = onlineUserIds.includes(member._id);
          });
        });
      })
    );
  });
};
