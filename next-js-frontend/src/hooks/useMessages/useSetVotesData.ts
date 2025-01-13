import type { Message } from "@/interfaces/message.interface";
import { setVotesData } from "../../services/redux/slices/uiSlice";
import { useAppDispatch } from "../../services/redux/store/hooks";

export const useSetVotesData = () => {
  const dispatch = useAppDispatch();

  const handleSetVotesData = (
    voteData: Pick<Message, "pollQuestion" | "pollOptions">
  ) => dispatch(setVotesData(voteData));
  return { handleSetVotesData };
};
