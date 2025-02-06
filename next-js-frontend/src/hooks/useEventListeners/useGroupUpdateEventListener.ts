import { Event } from "@/interfaces/events.interface";
import { chatApi } from "@/lib/client/rtk-query/chat.api";
import {
  selectSelectedChatDetails,
  updateChatNameOrAvatar,
} from "@/lib/client/slices/chatSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useGroupUpdateEventListener = () => {
  const dispatch = useAppDispatch();
  const selectedChatDetails = useAppSelector(selectSelectedChatDetails);

  useSocketEvent(
    Event.GROUP_UPDATE,
    ({
      _id,
      name,
      avatar,
    }: {
      _id: string;
      name?: string;
      avatar?: string;
    }) => {
      dispatch(
        chatApi.util.updateQueryData("getChats", undefined, (draft) => {
          const chat = draft.find((draft) => draft._id === _id);
          if (chat) {
            if (chat._id === selectedChatDetails?._id) {
              dispatch(updateChatNameOrAvatar({ name, avatar }));
            }
            if (name) chat.name = name;
            if (avatar) chat.avatar = avatar;
          }
        })
      );
    }
  );
};
