import { Message } from "@/interfaces/message.interface";
import { RefObject, useEffect } from "react";

type PropTypes = {
  container: HTMLDivElement | null; // The container element that holds the chat messages
  isNearBottom: boolean; // A boolean indicating if the user is near the bottom of the container
  messages: Message[]; // The list of messages that triggers scrolling when updated
  prevHeightRef: RefObject<number>; // A ref to store the previous container height
  prevScrollTopRef: RefObject<number>; // A ref to store the previous scroll position
};

export const useScrollToBottomOnNewMessage = ({
  container,
  isNearBottom,
  messages,
  prevHeightRef,
  prevScrollTopRef,
}: PropTypes) => {
  useEffect(() => {
    // This effect runs when 'messages' change (new message added), 
    // and will scroll to the bottom if the user is already near the bottom.
    
    if (container && isNearBottom) {
      // Reset the scroll position references, since we're going to re-align the scroll
      prevHeightRef.current = 0; // Reset previous container height
      prevScrollTopRef.current = 0; // Reset previous scroll position

      // Scroll the container to the very bottom after a small delay (50ms).
      // The delay ensures the DOM has time to render the new messages before scrolling.
      setTimeout(() => {
        // The scroll position is set to the container's scrollHeight to push it to the bottom
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  }, [container, isNearBottom, messages]); // Re-run the effect when messages change
};
