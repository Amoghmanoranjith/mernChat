import { Event } from "@/interfaces/events.interface";
import { EditMessageEventReceiveData } from "@/interfaces/message.interface";
import { messageApi } from "@/lib/client/rtk-query/message.api";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useMessageEditListener = () => {
  const dispatch = useAppDispatch();

  useSocketEvent(
    Event.MESSAGE_EDIT,
    ({ _id, chat, content, isEdited }: EditMessageEventReceiveData) => {
      dispatch(
        messageApi.util.updateQueryData(
          "getMessagesByChatId",
          { chatId: chat, page: 1 },
          (draft) => {
            const msg = draft.messages.find((draft) => draft._id === _id);
            if (msg) {
              msg.isEdited = isEdited;
              msg.content = content;
            }
          }
        )
      );
    }
  );
};
