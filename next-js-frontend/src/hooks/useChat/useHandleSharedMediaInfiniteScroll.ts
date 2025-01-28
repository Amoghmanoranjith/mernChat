import { useEffect, useState } from "react";
import { useFetchAttachments } from "../useAttachment/useFetchAttachments";

type PropTypes = {
    chatId:string
}

export const useHandleSharedMediaInfiniteScroll = ({chatId}:PropTypes) => {
    
    const { fetchAttachments,isFetching, sharedMedia } = useFetchAttachments();
    
    const [page,setPage] = useState(1);
    const [hasMore,setHasMore] = useState<boolean>(true);
    const totalPages = sharedMedia?.totalPages || 0;
    
    useEffect(()=>{
        if(hasMore && !isFetching){
            fetchAttachments({chatId,page})
        }
        if(page===totalPages){
            setHasMore(false)
        }
    },[page,hasMore])

    return {hasMore,setPage,sharedMedia,isFetching};
}
