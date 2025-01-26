import { useSendFriendRequestMutation } from "@/services/api/request.api"
import { useToast } from "../useUI/useToast"

export const useSendFriendRequest = () => {

    const [sendFriendRequest,{error,isError,isLoading,isSuccess,isUninitialized}] = useSendFriendRequestMutation()
    useToast({error,isError,isLoading,isSuccess,isUninitialized,loaderToast:true,successMessage:"Friend request sent",successToast:true})

    return {
        sendFriendRequest
    }
}
