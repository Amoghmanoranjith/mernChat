import { ACCEPTED_FILE_MIME_TYPES } from "@/constants";
import { useHandleSelectFileAttachments } from "@/hooks/useAttachment/useHandleSelectFileAttachments";
import { GalleryIcon } from "../ui/icons/GalleryIcon";

type PropTypes = {
  setAttachmentsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAttachments: React.Dispatch<React.SetStateAction<Blob[]>>;
};

export const AttachmentFileInput = ({
  setAttachmentsMenu,
  setSelectedAttachments,
}: PropTypes) => {
  const { handleFileChange } = useHandleSelectFileAttachments({
    setAttachmentsMenu,
    setSelectedAttachments,
  });

  return (
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
  );
};
