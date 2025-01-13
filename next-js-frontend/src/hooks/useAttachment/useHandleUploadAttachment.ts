import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { useSendAttachments } from "./useSendAttachments";

type PropTypes = {
  selectedChatDetails: ChatWithUnreadMessages;
  selectedAttachments: Blob[];
  setSelectedAttachments: React.Dispatch<React.SetStateAction<Array<Blob>>>;
};

export const useHandleUploadAttachment = ({
  selectedChatDetails,
  selectedAttachments,
  setSelectedAttachments,
}: PropTypes) => {
  const { uploadAttachment } = useSendAttachments();
  const handleUploadAttachments = () => {
    if (selectedChatDetails && selectedAttachments) {
      uploadAttachment({
        attachments: selectedAttachments,
        chatId: selectedChatDetails?._id,
      });
      setSelectedAttachments([]);
    }
  };

  return { handleUploadAttachments };
};
