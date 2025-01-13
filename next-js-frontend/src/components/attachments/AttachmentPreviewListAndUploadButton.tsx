import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { AttachmentUploadButton } from "./AttachmentUploadButton";
import { SelectedAttachmentsPreviewList } from "./SelectedAttachmentsPreviewList";

type PropTypes = {
  selectedChatDetails: ChatWithUnreadMessages;
  selectedAttachments: Blob[];
  setSelectedAttachments: React.Dispatch<React.SetStateAction<Blob[]>>;
  attachmentsPreview: string[];
};

export const AttachmentPreviewListAndUploadButton = ({
  attachmentsPreview,
  selectedAttachments,
  selectedChatDetails,
  setSelectedAttachments,
}: PropTypes) => {
  return (
    <div className="flex items-center flex-wrap gap-4 ml-auto w-fit">
      <SelectedAttachmentsPreviewList
        attachmentsPreview={attachmentsPreview}
        selectedAttachments={selectedAttachments}
        setSelectedAttachments={setSelectedAttachments}
      />
      <AttachmentUploadButton
        selectedAttachments={selectedAttachments}
        selectedChatDetails={selectedChatDetails}
        setSelectedAttachments={setSelectedAttachments}
      />
    </div>
  );
};
