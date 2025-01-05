import { useSignupMutation } from "@/services/api/auth.api"
import { useToast } from "../useUI/useToast"

export const useSignup = () => {

    const [signup,{data,isSuccess,isError,isLoading,isUninitialized,error}] = useSignupMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true})

    return {
        signup,
        isSuccess,
        isLoading,
        data
    }
}
