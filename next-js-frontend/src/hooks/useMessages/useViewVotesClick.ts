import { setVotesData } from "@/lib/client/slices/uiSlice";
import { useAppDispatch } from "@/lib/client/store/hooks";
import { useToggleViewVotes } from "../useUI/useToggleViewVotes";

type PropTypes = {
  options:string[];
  optionIndexToVotesMap: Record<number, {
    id: string;
    username: string;
    avatar: string;
}[]>
};

export const useViewVotesClick = ({optionIndexToVotesMap,options}: PropTypes) => {
  
  const { toggleViewVotes } = useToggleViewVotes();
  const dispatch = useAppDispatch();

  const handleViewVotesClick = () => {
    dispatch(setVotesData({options,optionIndexToVotesMap}));
    toggleViewVotes();
  };
  
  return { handleViewVotesClick };
};
