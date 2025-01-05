'use client';
import { useEffect } from "react"
import { useToast } from "../useUI/useToast"
import toast from "react-hot-toast"
import { useResetPasswordMutation } from "@/services/api/auth.api"
import { useRouter } from "next/navigation"

export const useResetPassword = () => {

    
    const router = useRouter();

    const [resetPassword,{error,isError,isLoading,isSuccess,isUninitialized}] = useResetPasswordMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Your password has been reset",successToast:true})

    useEffect(()=>{

        if(isSuccess){

            setTimeout(() => {
                toast.success("You will be redirected to login in 3 seconds")
            }, 1000);
    
            setTimeout(() => {
                router.push("/auth/login")
            }, 3000);

        }

        if(isError){
            router.push("/auth/login")
        }

    },[isSuccess,isError])

    return {
        resetPassword,
        isLoading,
    }
}
