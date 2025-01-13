import { ACCEPTED_FILE_MIME_TYPES } from "@/constants";
import toast from "react-hot-toast";

type PropTypes = {
  setAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAttachments: React.Dispatch<React.SetStateAction<Blob[]>>;
};

export const useHandleSelectFileAttachments = ({
  setAttachmentsMenu,
  setSelectedAttachments,
}: PropTypes) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachmentsMenu(false);
    const files = e.target.files;
    if (files) {
      if (files.length > 5) {
        e.target.value = "";
        toast.error("You can only select 5 files at a time");
        return;
      }
      const invalidFiles = Array.from(files).filter(
        (file) => !ACCEPTED_FILE_MIME_TYPES.includes(file.type)
      );
      if (invalidFiles.length > 0) {
        const invalidFileNames = invalidFiles
          .map((file) => file.name)
          .join(", ");
        toast.error(`Unsupported file types: ${invalidFileNames}`);
        e.target.value = "";
        return;
      }
      const blobFiles = Array.from(files).map((file) => file as Blob);
      setSelectedAttachments(blobFiles);
      e.target.value = "";
    }
  };

  return { handleFileChange };
};
