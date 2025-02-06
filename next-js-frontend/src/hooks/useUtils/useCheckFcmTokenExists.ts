import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/client/store/hooks";
import { selectLoggedInUser } from "../../lib/client/slices/authSlice";
import { setNotificationPermissionForm } from "../../lib/client/slices/uiSlice";

export const useCheckFcmTokenExists = () => {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(selectLoggedInUser);

  useEffect(() => {
    if (loggedInUser && !loggedInUser.fcmTokenExists)
      dispatch(setNotificationPermissionForm(true));
  }, [loggedInUser]);
};
