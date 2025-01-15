import { Event } from "@/interfaces/events.interface";
import type { FriendRequest } from "@/interfaces/request.interface";
import { requestApi } from "@/services/api/request.api";
import { useAppDispatch } from "@/services/redux/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useFriendRequestListener = () => {
  const dispatch = useAppDispatch();

  useSocketEvent(Event.NEW_FRIEND_REQUEST, (newRequest: FriendRequest) => {
    dispatch(
      requestApi.util.updateQueryData(
        "getUserFriendRequests",
        undefined,
        (draft) => {
          draft.push(newRequest);
        }
      )
    );
  });
};
