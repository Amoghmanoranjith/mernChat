import { useHandleUploadAttachment } from "@/hooks/useAttachment/useHandleUploadAttachment";
import { motion } from "framer-motion";
import { UploadIcon } from "../ui/icons/UploadIcon";

type PropTypes = {
  selectedAttachments: Array<Blob>;
  setSelectedAttachments: React.Dispatch<React.SetStateAction<Array<Blob>>>;
  selectedChatDetails: any;
};

export const AttachmentUploadButton = ({
  selectedAttachments,
  selectedChatDetails,
  setSelectedAttachments,
}: PropTypes) => {
  const { handleUploadAttachments } = useHandleUploadAttachment({
    selectedAttachments,
    selectedChatDetails,
    setSelectedAttachments,
  });

  return (
    <motion.button
      type="button"
      onClick={handleUploadAttachments}
      className="p-4 bg-primary text-white rounded-full shadow-xl"
    >
      <UploadIcon />
    </motion.button>
  );
};
