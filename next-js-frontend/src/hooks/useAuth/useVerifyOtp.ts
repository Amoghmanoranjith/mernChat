'use client';
import { useVerifyOtpMutation } from "@/services/api/auth.api"
import { useToast } from "../useUI/useToast"
import { useUpdateLogin } from "./useUpdateLoggedInUserState"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export const useVerifyOtp = () => {

    const router = useRouter();
    const [verifyOtp,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useVerifyOtpMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Awesome!🎉 thankyou for verifying the otp",successToast:true})

    useUpdateLogin(isSuccess,data)

    useEffect(()=>{
        if(isSuccess) router.replace('/');
    },[isSuccess])

    return {
        verifyOtp,
        isLoading
    }

}
