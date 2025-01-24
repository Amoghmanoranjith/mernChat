import { RefObject } from "react";

type PropTypes = {
  containerRef: RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export const useHandleSharedMediaScroll = ({containerRef,hasMore,setPage}:PropTypes) => {

  const handleSharedMediaScroll = ()=>{
    const container = containerRef?.current;
    if(container){
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 120;
        if(isAtBottom && hasMore){
            setPage(prev=>prev+1)
        }
    }
  }
  return {handleSharedMediaScroll};
}
