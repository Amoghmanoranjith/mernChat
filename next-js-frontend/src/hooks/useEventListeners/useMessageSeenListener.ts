import { Event } from "@/interfaces/events.interface";
import { MessageSeenEventReceiveData } from "@/interfaces/message.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import { selectLoggedInUser } from "@/lib/client/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useMessageSeenListener = () => {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectLoggedInUser);

  useSocketEvent(
    Event.MESSAGE_SEEN,
    ({ chat: chatId, user }: MessageSeenEventReceiveData) => {
      const isOwnMessageSeenUpdate = user._id === loggedInUser?._id;

      dispatch(
        chatApi.util.updateQueryData("getChats", undefined, (draft) => {
          const chat = draft.find((draft) => draft._id === chatId);
          if (chat && isOwnMessageSeenUpdate) chat.unreadMessages.count = 0;
        })
      );
    }
  );
};
