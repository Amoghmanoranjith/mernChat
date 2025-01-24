import { useToggleRecoverPrivateKeyForm } from "../useUI/useToggleRecoverPrivateKeyForm";
import { useLogout } from "./useLogout";

export const useHandleLogoutClickOnKeyRecoveryForm = () => {
  const { logoutUser } = useLogout();
  const { toggleRecoverPrivateKeyForm } = useToggleRecoverPrivateKeyForm();

  const handleLogoutClick = () => {
    toggleRecoverPrivateKeyForm();
    logoutUser();
  };

  return { handleLogoutClick };
};
