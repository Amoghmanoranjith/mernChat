"use client";
import type { User } from "@/interfaces/auth.interface";
import { useEffect } from "react";
import { updateLoggedInUser } from "../../services/redux/slices/authSlice";
import { useAppDispatch } from "../../services/redux/store/hooks";

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
  }, [isSuccess]);
};
