import { useLazyLogoutQuery } from "@/services/api/auth.api";
import { updateLoggedInUser } from "@/services/redux/slices/authSlice";
import { useAppDispatch } from "../../services/redux/store/hooks";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutTrigger, {}] = useLazyLogoutQuery();

  const logoutUser = () => {
    logoutTrigger();
    dispatch(updateLoggedInUser(null));
    router.replace("/auth/login");
  };
  return { logoutUser };
};
