import { setNavMenu } from "@/services/redux/slices/uiSlice";
import { useAppDispatch } from "@/services/redux/store/hooks";

export const useCloseNavMenu = () => {
  const dispatch = useAppDispatch();
  const closeNavMenu = () => {
    dispatch(setNavMenu(false));
  };
  return { closeNavMenu };
};
