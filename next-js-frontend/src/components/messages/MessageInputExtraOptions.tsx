import { motion } from "framer-motion";
import { AttachmentIcon } from "../ui/icons/AttachmentIcon";
import { GifIcon } from "../ui/icons/GifIcon";
import { useToggleGif } from "@/hooks/useUI/useToggleGif";

type PropTypes = {
  toggleAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MessageInputExtraOptions = ({
  toggleAttachmentsMenu,
}: PropTypes) => {

  const {toggleGifForm} = useToggleGif();

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

      <button onClick={toggleGifForm} type="button" className="px-3 py-4 hover:text-primary">
        <GifIcon />
      </button>
    </motion.div>
  );
};
