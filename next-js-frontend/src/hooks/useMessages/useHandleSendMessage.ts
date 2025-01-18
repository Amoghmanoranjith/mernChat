import { useSendMessage } from "./useSendMessage";

type PropTypes = {
  messageVal: string;
  setMessageVal: React.Dispatch<React.SetStateAction<string>>;
};

export const useHandleSendMessage = ({
  messageVal,
  setMessageVal,
}: PropTypes) => {
  const { sendMessage } = useSendMessage();

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (messageVal.trim().length) {
      sendMessage(messageVal);
    }
    setMessageVal("");
  };

  return { handleMessageSubmit };
};
