import { useFetchAttachments } from "@/hooks/useAttachment/useFetchAttachments";
import { useHandleSharedMediaInfiniteScroll } from "@/hooks/useChat/useHandleSharedMediaInfiniteScroll";
import { useHandleSharedMediaScroll } from "@/hooks/useChat/useHandleSharedMediaScroll";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import Image from "next/image";
import { useRef } from "react";

export const SharedMediaList = () => {

    const {fetchMoreAttachments,isAttachmentsFetching,sharedMedia} = useFetchAttachments();
    const containerRef = useRef<HTMLDivElement>(null)
    
    const chatId =  useAppSelector(selectSelectedChatDetails)?._id as string;
    const {hasMore,setPage} = useHandleSharedMediaInfiniteScroll({chatId,fetchMoreAttachments,totalPages:sharedMedia?.totalPages})
    const {handleSharedMediaScroll} = useHandleSharedMediaScroll({containerRef,hasMore,setPage});

  return (
    <div ref={containerRef} onScroll={handleSharedMediaScroll} className="grid grid-cols-2 gap-4 place-items-center h-[28rem] overflow-y-auto">
        {
            !isAttachmentsFetching && sharedMedia?.attachments.map(url=><Image key={url} height={200} width={200} className="w-40 h-40 object-cover" src={url} alt={"attachment"}/>)
        }
    </div>  
  )
}
