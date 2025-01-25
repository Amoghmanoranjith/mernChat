import { useRouter } from "next/navigation";
import { useEffect } from "react";

type PropTypes = {
  isSuccess: boolean;
  isError: boolean;
};

export const useNavigateToLoginPageOnResetPasswordSuccessOrError = ({
  isError,
  isSuccess,
}: PropTypes) => {
  const router = useRouter();

  useEffect(() => {
    if (isSuccess || isError) {
      router.replace("/auth/login");
    }
  }, [isSuccess, isError]);
};
