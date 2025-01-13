import { motion } from "framer-motion";
import { AttachmentIcon } from "../ui/icons/AttachmentIcon";
import { GifIcon } from "../ui/icons/GifIcon";

type PropTypes = {
  toggleAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  toggleGif: () => void;
};

export const MessageInputExtraOptions = ({
  toggleAttachmentsMenu,
  toggleGif,
}: PropTypes) => {
  return (
    <motion.div
      variants={{ hide: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      initial="hide"
      animate="show"
      className="flex"
    >
      <button
        onClick={() => toggleAttachmentsMenu((prev) => !prev)}
        className="px-3 py-4 justify-center items-center flex relative"
      >
        <AttachmentIcon />
      </button>

      <button onClick={toggleGif} type="button" className="px-3 py-4">
        <GifIcon />
      </button>
    </motion.div>
  );
};
