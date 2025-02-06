import { Event } from "@/interfaces/events.interface";
import { DeleteReactionEventReceiveData } from "@/interfaces/message.interface";
import { messageApi } from "@/lib/client/rtk-query/message.api";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useSocketEvent } from "../useSocket/useSocketEvent";

export const useDeleteReactionListener = () => {
  const dispatch = useAppDispatch();
  useSocketEvent(
    Event.DELETE_REACTION,
    ({ chatId, messageId, userId }: DeleteReactionEventReceiveData) => {
      dispatch(
        messageApi.util.updateQueryData(
          "getMessagesByChatId",
          { chatId, page: 1 },
          (draft) => {
            const message = draft.messages.find(
              (draft) => draft._id === messageId
            );
            if (message && message?.reactions?.length) {
              const reactionToBeRemovedIndex = message.reactions.findIndex(
                (reaction) => reaction.user._id === userId
              );
              if (reactionToBeRemovedIndex !== -1)
                message.reactions.splice(reactionToBeRemovedIndex, 1);
            }
          }
        )
      );
    }
  );
};
