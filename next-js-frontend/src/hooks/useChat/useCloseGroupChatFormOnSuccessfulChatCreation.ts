import { useEffect } from "react";
import { useToggleGroupChatForm } from "../useUI/useToggleGroupChatForm";

type PropTypes = {
  isSuccess: boolean;
};

export const useCloseGroupChatFormOnSuccessfulChatCreation = ({
  isSuccess,
}: PropTypes) => {
  const { toggleGroupChatForm } = useToggleGroupChatForm();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isSuccess) {
      timeout = setTimeout(() => {
        toggleGroupChatForm();
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isSuccess]);
};
