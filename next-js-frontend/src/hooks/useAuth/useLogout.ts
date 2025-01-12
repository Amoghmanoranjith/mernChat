import { useLazyLogoutQuery } from "@/services/api/auth.api";
import { logout } from "../../services/redux/slices/authSlice";
import { useAppDispatch } from "../../services/redux/store/hooks";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const [logoutTrigger, {}] = useLazyLogoutQuery();

  const logoutUser = () => {
    logoutTrigger();
    dispatch(logout());
  };
  return { logoutUser };
};
