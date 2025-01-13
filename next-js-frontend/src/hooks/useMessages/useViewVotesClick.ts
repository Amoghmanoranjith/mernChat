import { Message } from "@/interfaces/message.interface";
import { useToggleViewVotes } from "../useUI/useToggleViewVotes";
import { useSetVotesData } from "./useSetVotesData";

type PropTypes = {
  pollQuestion: string;
  pollOptions: Message["pollOptions"];
};

export const useViewVotesClick = ({ pollOptions, pollQuestion }: PropTypes) => {
  const { toggleViewVotes } = useToggleViewVotes();
  const { handleSetVotesData } = useSetVotesData();

  const handleViewVotesClick = () => {
    toggleViewVotes();
    handleSetVotesData({ pollQuestion, pollOptions });
  };

  return { handleViewVotesClick };
};
