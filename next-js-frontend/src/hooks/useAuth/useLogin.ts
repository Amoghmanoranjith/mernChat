import { useLoginMutation } from "@/services/api/auth.api"
import { useToast } from "../useUi/useToast"

export const useLogin = () => {

    const [login,{data,isSuccess,isError,isLoading,isUninitialized,error}] = useLoginMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true})

    return {
        login,
        isSuccess,
        data,
        isLoading
    }
}
