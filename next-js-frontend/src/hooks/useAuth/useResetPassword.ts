'use client';
import { useResetPasswordMutation } from "@/services/api/auth.api";
import { useToast } from "../useUI/useToast";

export const useResetPassword = () => {

    const [resetPassword,{error,isError,isLoading,isSuccess,isUninitialized}] = useResetPasswordMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,successMessage:"Your password has been reset",successToast:true})

    return {
        resetPassword,
        isLoading,
        isError,
        isSuccess,
    }
}
