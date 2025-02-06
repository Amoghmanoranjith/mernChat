"use client";
import { useVerifyOtpMutation } from "@/lib/client/rtk-query/auth.api";
import { useToast } from "../useUI/useToast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUpdateLoggedInUserState } from "./useUpdateLoggedInUserState";

export const useVerifyOtp = () => {
  const router = useRouter();
  const [
    verifyOtp,
    { error, isError, isLoading, isSuccess, isUninitialized, data },
  ] = useVerifyOtpMutation();
  useToast({
    error,
    isError,
    isLoading,
    isSuccess,
    isUninitialized,
    loaderToast: true,
    successMessage: "Awesome!🎉 thankyou for verifying the otp",
    successToast: true,
  });

  useUpdateLoggedInUserState({ isSuccess, user: data });

  useEffect(() => {
    if (isSuccess) router.replace("/");
  }, [isSuccess]);

  return {
    verifyOtp,
    isLoading,
  };
};
