import { useSendMessage } from "./useSendMessage";

type PropTypes = {
  messageVal: string;
  setMessageVal: React.Dispatch<React.SetStateAction<string>>;
  setEmojiForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useHandleSendMessage = ({
  messageVal,
  setEmojiForm,
  setMessageVal,
}: PropTypes) => {
  const { sendMessage } = useSendMessage();

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMessageVal("");
    if (messageVal.trim().length) {
      sendMessage();
      setEmojiForm(false);
    }
  };

  return { handleMessageSubmit };
};
