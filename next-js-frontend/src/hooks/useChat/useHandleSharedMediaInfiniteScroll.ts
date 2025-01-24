import { useEffect, useState } from "react";

type PropTypes = {
    totalPages:number | undefined;
    chatId:string
    fetchMoreAttachments:({ chatId, page }: {
        chatId: string;
        page: number;
    }) => void;
}

export const useHandleSharedMediaInfiniteScroll = ({totalPages,chatId,fetchMoreAttachments}:PropTypes) => {
    
    
    const [page,setPage] = useState(1) 
    const [hasMore,setHasMore] = useState<boolean>(true)
    
    useEffect(()=>{
        if(hasMore){
            fetchMoreAttachments({chatId,page})
        }
        if(page===totalPages){
            setHasMore(false)
        }
    },[page,hasMore])

    return {hasMore,setPage};

}
