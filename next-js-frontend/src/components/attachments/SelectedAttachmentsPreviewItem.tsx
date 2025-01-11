"use client";
import { motion } from "framer-motion";

type PropTypes = {
  preview: string;
  handleRemoveSelectedAttachment: (indexToBeRemoved: number) => void;
  index: number;
};

export const SelectedAttachmentPreviewItem = ({
  preview,
  handleRemoveSelectedAttachment,
  index,
}: PropTypes) => {
  return (
    <motion.div whileHover={{ scale: 1.05, y: -5 }} className="relative">
      <button
        onClick={() => handleRemoveSelectedAttachment(index)}
        className="absolute bg-gray-300 rounded-full w-7 h-7 -right-2 -top-2"
      >
        -
      </button>
      <img className="w-20 h-20 object-cover" src={preview} alt="" />
    </motion.div>
  );
};
