import { useLazyFetchAttachmentsQuery } from "@/services/api/attachment.api"
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice"
import { useEffect } from "react"
import { useAppSelector } from "../../services/redux/store/hooks"
import { useToast } from "../useUI/useToast"

export const useFetchAttachments = () => {

    const selectedChatId = useAppSelector(selectSelectedChatDetails)?._id
    const [fetchAttachments, {error,isError,isFetching,isSuccess,isUninitialized,currentData}] = useLazyFetchAttachmentsQuery()
    useToast({error,isError,isLoading:isFetching,isSuccess,isUninitialized})

    useEffect(()=>{
        if(selectedChatId){
            fetchAttachments({chatId:selectedChatId,page:1},true);
        }
    },[selectedChatId])

    return {
        fetchAttachments,
        sharedMedia:currentData,
        isFetching,
    }
}
