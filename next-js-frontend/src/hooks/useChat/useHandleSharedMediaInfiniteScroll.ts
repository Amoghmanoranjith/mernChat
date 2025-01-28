import { useEffect, useState } from "react";

type PropTypes = {
    totalPages:number | undefined;
    chatId:string
    fetchMoreAttachments:({ chatId, page }: {
        chatId: string;
        page: number;
    }) => void;
    isAttachmentsFetching:boolean;
}

export const useHandleSharedMediaInfiniteScroll = ({totalPages,chatId,fetchMoreAttachments,isAttachmentsFetching}:PropTypes) => {
    
    
    const [page,setPage] = useState(1);
    const [hasMore,setHasMore] = useState<boolean>(true)
    
    useEffect(()=>{
        if(hasMore && !isAttachmentsFetching){
            fetchMoreAttachments({chatId,page})
        }
        if(page===totalPages){
            setHasMore(false)
        }
    },[page,hasMore])

    return {hasMore,setPage};

}
