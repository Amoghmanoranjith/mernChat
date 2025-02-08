import { ACCEPTED_FILE_MIME_TYPES } from "@/constants";
import { useHandleSelectFileAttachments } from "@/hooks/useAttachment/useHandleSelectFileAttachments";
import { useTogglePollForm } from "@/hooks/useUI/useTogglePollForm";
import { motion } from "framer-motion";
import { GalleryIcon } from "../ui/icons/GalleryIcon";
import { PollingIcon } from "../ui/icons/PollingIcon";

type PropTypes = {
  setAttachmentsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAttachments: React.Dispatch<React.SetStateAction<Blob[]>>;
};

export const AttachmentMenu = ({
  setAttachmentsMenuOpen,
  setSelectedAttachments,
}: PropTypes) => {
  const { togglePollForm } = useTogglePollForm();

  const handlePollClick = () => {
    setAttachmentsMenuOpen(false);
    togglePollForm();
  };

  const { handleFileChange } = useHandleSelectFileAttachments({
    setAttachmentsMenuOpen,
    setSelectedAttachments,
  });

  return (
    <motion.div
      variants={{
        hide: { y: 40, opacity: 0 },
        show: { y: 0, opacity: 1 },
      }}
      initial="hide"
      exit={"hide"}
      animate="show"
      className="bg-secondary-dark p-4 w-36 rounded-md absolute -top-28 right-0 flex justify-between"
    >
      <div className="flex flex-col items-center relative">
        <GalleryIcon />
        <p className="text-text">Gallery</p>
        <input
          onChange={handleFileChange}
          accept={ACCEPTED_FILE_MIME_TYPES.join(",")}
          multiple
          type="file"
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div
        onClick={handlePollClick}
        className="flex flex-col items-center cursor-pointer"
      >
        <PollingIcon />
        <p className="text-text">Poll</p>
      </div>
      
    </motion.div>
  );
};
