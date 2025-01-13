import { selectViewVotes, setViewVotes } from "@/services/redux/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store/hooks";

export const useToggleViewVotes = () => {
  const dispatch = useAppDispatch();
  const viewVotes = useAppSelector(selectViewVotes);

  const toggleViewVotes = () => {
    dispatch(setViewVotes(!viewVotes));
  };
  return { toggleViewVotes };
};
