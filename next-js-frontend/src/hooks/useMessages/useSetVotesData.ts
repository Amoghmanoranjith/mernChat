import type { Message } from "@/interfaces/message.interface";
import { setVotesData } from "../../lib/client/slices/uiSlice";
import { useAppDispatch } from "../../lib/client/store/hooks";

export const useSetVotesData = () => {
  const dispatch = useAppDispatch();

  const handleSetVotesData = (
    voteData: Pick<Message, "pollQuestion" | "pollOptions">
  ) => dispatch(setVotesData(voteData));
  return { handleSetVotesData };
};
