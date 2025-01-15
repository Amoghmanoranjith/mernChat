import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/services/api/chat.api";
import { friendApi } from "@/services/api/friend.api";
import { useAppDispatch } from "@/services/redux/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useOfflineListener = () => {
  const dispatch = useAppDispatch();

  useSocketEvent(Event.OFFLINE, (userId: string) => {
    dispatch(
      friendApi.util.updateQueryData("getFriends", undefined, (draft) => {
        const friend = draft.find((draft) => draft._id === userId);
        if (friend) {
          friend.isActive = false;
        }
      })
    );

    dispatch(
      chatApi.util.updateQueryData("getChats", undefined, (draft) => {
        draft.map((chat) => {
          const user = chat.members.find((member) => member._id === userId);
          if (user) {
            user.isActive = false;
          }
        });
      })
    );
  });
};
