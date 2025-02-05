import { logout } from "@/actions/auth.actions";
import { useToggleRecoverPrivateKeyForm } from "../useUI/useToggleRecoverPrivateKeyForm";


export const useHandleLogoutClickOnKeyRecoveryForm = () => {
  const { toggleRecoverPrivateKeyForm } = useToggleRecoverPrivateKeyForm();

  const handleLogoutClick = () => {
    toggleRecoverPrivateKeyForm();
    logout();
  };

  return { handleLogoutClick };
};
