import {
  selectChatUpdateForm,
  setChatUpdateForm,
} from "../../lib/client/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../lib/client/store/hooks";

export const useToggleChatUpdateForm = () => {
  const dispatch = useAppDispatch();
  const chatUpdateForm = useAppSelector(selectChatUpdateForm);

  return () => {
    dispatch(setChatUpdateForm(!chatUpdateForm));
  };
};
