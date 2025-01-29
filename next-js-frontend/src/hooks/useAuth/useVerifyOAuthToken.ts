import { useVerifyOAuthTokenMutation } from "@/services/api/auth.api";
import { useToast } from "../useUI/useToast";

export const useVerifyOAuthToken = () => {

    const [verifyOAuthToken,{error,isError,isLoading,isSuccess,isUninitialized,data}] = useVerifyOAuthTokenMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Welcome to baatchit, we are happy to have you on-board",successToast:true})

    return {
        verifyOAuthToken,
        isTokenVerificationSucessfull:isSuccess,
        isLoading,
        data,
    }
}
