import {
  setFriendRequestForm,
  setNavMenu,
} from "../../services/redux/slices/uiSlice";
import { useAppDispatch } from "../../services/redux/store/hooks";

export const useOpenFriendRequestForm = () => {
  const dispatch = useAppDispatch();

  const openFriendRequestForm = () => {
    dispatch(setNavMenu(false));
    dispatch(setFriendRequestForm(true));
  };

  return { openFriendRequestForm };
};
