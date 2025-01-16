import { useUpdateNotificationsMutation } from "@/services/api/user.api";
import { useToast } from "../useUI/useToast";

export const useUpdateNotificationsFlag = () => {
  const [
    updateNotificationsFlag,
    { error, isError, isLoading, isSuccess, isUninitialized },
  ] = useUpdateNotificationsMutation();
  useToast({ error, isError, isLoading, isSuccess, isUninitialized });

  return {
    updateNotificationsFlag,
  };
};
