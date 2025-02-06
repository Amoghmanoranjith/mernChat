import { useUpdateNotificationsMutation } from "@/lib/client/rtk-query/user.api";
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
