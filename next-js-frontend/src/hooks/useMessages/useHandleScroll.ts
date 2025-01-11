import { useEffect } from "react";

type PropTypes = {
    container: HTMLDivElement | null;
    hasMoreMessages: boolean;
    IsFetchingMessages: boolean;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setIsNearBottom: React.Dispatch<React.SetStateAction<boolean>>;
    prevHeightRef: React.RefObject<number>;
    prevScrollTopRef: React.RefObject<number>;
}

export const useHandleScroll = ({IsFetchingMessages,container,hasMoreMessages,prevHeightRef,prevScrollTopRef,setIsNearBottom,setPage}:PropTypes) => {
  
  const handleScroll = () => {
    // Check if we are close to the top to load more messages
    if (
      container &&
      container.scrollTop <= 284 &&
      hasMoreMessages &&
      !IsFetchingMessages
    ) {
      // Save the current scroll height and scroll position before loading more messages,
      // so we can preserve the user's scroll position later.
      prevHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;

      // Increment the page number to trigger the loading of the next set of messages.
      setPage((prev) => prev + 1);
    }

    // Check if we are near the bottom of the container
    if (container) {
      // Calculate if the user is near the bottom of the container:
      // - `container.scrollHeight - container.scrollTop`: This gives the distance from the bottom of the content to the current scroll position.
      // - `container.clientHeight`: The visible height of the container.
      // - `+ 150`: This offset (150px) allows us to trigger the "near bottom" condition slightly before reaching the exact bottom.
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 150;

      // Update the state to reflect whether the user is near the bottom.
      setIsNearBottom(isAtBottom);
    }
  };

   // Attach the handleScroll function to the container on scroll
   useEffect(() => {
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Cleanup the event listener when the component is unmounted or container changes
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [container, hasMoreMessages, IsFetchingMessages, setPage, setIsNearBottom, prevHeightRef, prevScrollTopRef]);


};
