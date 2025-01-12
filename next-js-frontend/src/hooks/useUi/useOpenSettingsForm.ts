import { setNavMenu, setSettingsForm } from "@/services/redux/slices/uiSlice";
import { useAppDispatch } from "@/services/redux/store/hooks";

export const useOpenSettingsForm = () => {
  const dispatch = useAppDispatch();
  const openSettingsForm = () => {
    dispatch(setNavMenu(false));
    dispatch(setSettingsForm(true));
  };
  return { openSettingsForm };
};
