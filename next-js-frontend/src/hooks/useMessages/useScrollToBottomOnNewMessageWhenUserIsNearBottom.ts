import { Message } from "@/interfaces/message.interface";
import { RefObject, useEffect } from "react";

type PropTypes = {
  container: RefObject<HTMLDivElement | null> // The container element that holds the chat messages
  isNearBottom : boolean; // A boolean indicating whether the user is near the bottom of the chat
  messages: Message[]; // The list of messages that triggers scrolling when updated
  prevHeightRef: RefObject<number>; // A ref to store the previous container height
  prevScrollTopRef: RefObject<number>; // A ref to store the previous scroll position
};

export const useScrollToBottomOnNewMessageWhenUserIsNearBottom = ({
  container,
  isNearBottom,
  messages,
  prevHeightRef,
  prevScrollTopRef,
}: PropTypes) => {
  useEffect(() => {
    if (!container) return;

    if (isNearBottom) {
      prevHeightRef.current = 0;
      prevScrollTopRef.current = 0;

      // Ensure the container scrolls to the bottom
      setTimeout(() => {
        if (container.current) {
          container.current.scrollTop = container.current.scrollHeight;
        }
      }, 100); // adding delay to ensure that first the new message is rendered and then scroll to bottom
    }
  }, [messages]); // Only depend on 'messages'
};
