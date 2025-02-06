"use client";
import type { User } from "@/interfaces/auth.interface";
import { useEffect } from "react";
import { updateLoggedInUser } from "../../lib/client/slices/authSlice";
import { useAppDispatch } from "../../lib/client/store/hooks";

type PropTypes = {
  isSuccess: boolean;
  user: User | null | undefined;
};

export const useUpdateLoggedInUserState = ({ user, isSuccess }: PropTypes) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isSuccess && user) {
      dispatch(updateLoggedInUser(user));
    }
  }, [dispatch, isSuccess, user]);
};
