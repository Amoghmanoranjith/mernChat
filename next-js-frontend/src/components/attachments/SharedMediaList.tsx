import { useHandleSharedMediaInfiniteScroll } from "@/hooks/useChat/useHandleSharedMediaInfiniteScroll";
import { useHandleSharedMediaScroll } from "@/hooks/useChat/useHandleSharedMediaScroll";
import { selectSelectedChatDetails } from "@/services/redux/slices/chatSlice";
import { useAppSelector } from "@/services/redux/store/hooks";
import Image from "next/image";
import { useRef } from "react";
import { CircleLoading } from "../shared/CircleLoading";

export const SharedMediaList = () => {

  const containerRef = useRef<HTMLDivElement>(null);
  const chatId = useAppSelector(selectSelectedChatDetails)?._id as string;

  const { hasMore, setPage, sharedMedia, isFetching} = useHandleSharedMediaInfiniteScroll({chatId});
  const { handleSharedMediaScroll } = useHandleSharedMediaScroll({containerRef,hasMore,setPage,isFetching});

  
  return (
    <div
      ref={containerRef}
      onScroll={handleSharedMediaScroll}
      className="grid grid-cols-2 gap-4 place-items-center h-[28rem] overflow-y-auto"
    >
    {sharedMedia?.attachments.map((url) => (
        <Image
          key={url}
          height={200}
          width={200}
          className="w-40 h-40 object-cover"
          src={url}
          alt={"attachment"}
        />
      ))}
      {isFetching && <CircleLoading/>}
    </div>
  );
};
