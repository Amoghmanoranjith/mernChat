import { Dispatch, RefObject, SetStateAction, useLayoutEffect } from "react";
import { useClearAdditionalMessagesOnChatChange } from "./useClearAdditionalMessagesOnChatChange";


type PropTypes = {
  setPage:Dispatch<SetStateAction<number>>
  messageContainerRef:RefObject<HTMLDivElement | null>
  selectedChatId:string | null | undefined
}

export const useScrollBottomAndSetPageTo1AndClearAdditionalMessagesOnChatChange = ({messageContainerRef,setPage,selectedChatId}:PropTypes) => {

    const {clearExtraPreviousMessages} = useClearAdditionalMessagesOnChatChange();
  
    useLayoutEffect(() => {
      setPage(1);
  
      const container = messageContainerRef.current;
      if (container) {
        const timeoutId = setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 100);
  
        return () => {
          if(selectedChatId) clearExtraPreviousMessages(selectedChatId);
          clearTimeout(timeoutId);
        };
      }
    }, [selectedChatId]);
  
}
