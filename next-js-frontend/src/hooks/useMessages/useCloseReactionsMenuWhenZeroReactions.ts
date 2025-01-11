import { Message } from "@/interfaces/message.interface";
import { useEffect } from "react";

export const useCloseReactionsMenuWhenZeroReactions = (
  message: Message,
  setReactionMenuMessageId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
) => {
  return useEffect(() => {
    if (message?.reactions?.length === 0) {
      setReactionMenuMessageId(undefined);
    }
  }, [message?.reactions?.length]);
};
