"use client";
import { useHandleRemoveSelectedAttachment } from "@/hooks/useAttachment/useHandleRemoveSelectedAttachment";
import { Dispatch, SetStateAction } from "react";
import { SelectedAttachmentPreviewItem } from "./SelectedAttachmentsPreviewItem";

type PropTypes = {
  attachmentsPreview: string[];
  setSelectedAttachments: Dispatch<SetStateAction<Blob[]>>;
  selectedAttachments: Blob[];
};

export const SelectedAttachmentsPreviewList = ({
  attachmentsPreview,
  setSelectedAttachments,
  selectedAttachments,
}: PropTypes) => {
  
  const { handleRemoveSelectedAttachment } = useHandleRemoveSelectedAttachment({
    selectedAttachments,
    setSelectedAttachments,
  });

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {attachmentsPreview.map((preview, index) => (
        <SelectedAttachmentPreviewItem
          handleRemoveSelectedAttachment={handleRemoveSelectedAttachment}
          index={index}
          preview={preview}
          key={index}
        />
      ))}
    </div>
  );
};
