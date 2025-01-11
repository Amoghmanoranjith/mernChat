import { motion } from "framer-motion";
import { UploadIcon } from "../ui/icons/UploadIcon";
import { useSendAttachments } from "@/hooks/useAttachment/useSendAttachments";

type PropTypes = {
    selectedAttachments: Array<Blob>;
    setSelectedAttachments: React.Dispatch<React.SetStateAction<Array<Blob>>>;
    setAttachmentsPreview: React.Dispatch<React.SetStateAction<Array<string>>>;
    selectedChatDetails: any;
}

export const AttachmentUploadButton = ({selectedAttachments,selectedChatDetails,setAttachmentsPreview,setSelectedAttachments}:PropTypes) => {

    const {uploadAttachment} = useSendAttachments();

    const handleUploadAttachments = ()=>{
        if(selectedChatDetails && selectedAttachments){
          uploadAttachment({
            attachments:selectedAttachments,
            chatId:selectedChatDetails?._id,
          })
          setSelectedAttachments([])
          setAttachmentsPreview([])
        }
      }

  return (
    <motion.button
      type="button"
      onClick={handleUploadAttachments}
      className="p-4 bg-primary text-white rounded-full shadow-xl"
    >
      <div className="flex items-center gap-x-3">
        <UploadIcon />
        <p className="hidden">Uploading</p>
      </div>
    </motion.button>
  );
};
