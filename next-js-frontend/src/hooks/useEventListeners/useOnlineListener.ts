import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { friendApi } from "@/lib/client/rtk-query/friend.api";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useOnlineListener = () => {
  const dispatch = useAppDispatch();

  useSocketEvent(Event.ONLINE, (userId: string) => {
    dispatch(
      friendApi.util.updateQueryData("getFriends", undefined, (draft) => {
        const friend = draft.find((draft) => draft._id === userId);

        if (friend) {
          friend.isActive = true;
        }
      })
    );

    dispatch(
      chatApi.util.updateQueryData("getChats", undefined, (draft) => {
        draft.map((chat) => {
          const user = chat.members.find((member) => member._id === userId);
          if (user) {
            user.isActive = true;
          }
        });
      })
    );
  });
};
