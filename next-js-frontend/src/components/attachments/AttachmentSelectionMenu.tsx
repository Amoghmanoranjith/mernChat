import { useTogglePoolForm } from "@/hooks/useUI/useTogglePoolForm";
import { motion } from "framer-motion";
import { PollingIcon } from "../ui/icons/PollingIcon";
import { AttachmentFileInput } from "./AttachmentFileInput";

type PropTypes = {
  setAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAttachments: React.Dispatch<React.SetStateAction<Blob[]>>;
};

export const AttachmentSelectionMenu = ({
  setAttachmentsMenu,
  setSelectedAttachments,
}: PropTypes) => {
  const { togglePollForm } = useTogglePoolForm();

  const handlePollClick = () => {
    setAttachmentsMenu(false);
    togglePollForm();
  };
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
      <AttachmentFileInput
        setAttachmentsMenu={setAttachmentsMenu}
        setSelectedAttachments={setSelectedAttachments}
      />
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
