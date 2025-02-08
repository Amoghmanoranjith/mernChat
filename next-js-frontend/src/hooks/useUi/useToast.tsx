"use client";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { isErrorWithMessage } from "../../lib/shared/helpers";

type PropTypes = {
  isLoading: boolean;
  isUninitialized: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
  loaderToast?: boolean;
  errorToast?: boolean;
  successToast?: boolean;
  successMessage?: string;
};
export const useToast = ({
  error,
  isError,
  isLoading,
  isSuccess,
  isUninitialized,
  loaderToast = false,
  errorToast = true,
  successToast = false,
  successMessage = "success",
}: PropTypes) => {
  useEffect(() => {
    if (!isUninitialized) {
      if (isLoading && loaderToast) toast.loading("loading");
      if (!isLoading && !isSuccess && isError && errorToast) {
        toast.dismiss();
        if (isErrorWithMessage(error)) toast.error(error.data.message);
        else toast.error("some Error occured");
      }
      if (!isLoading && isSuccess && successToast) {
        toast.dismiss();
        toast.success(successMessage);
      }
    }
  }, []);
};
