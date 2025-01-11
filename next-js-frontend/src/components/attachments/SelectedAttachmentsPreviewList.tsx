"use client";
import { Dispatch, SetStateAction } from "react";
import { SelectedAttachmentPreviewItem } from "./SelectedAttachmentsPreviewItem";

type PropTypes = {
  attachmentsPreview: string[];
  setSelectedAttachments: Dispatch<SetStateAction<Blob[]>>;
  setAttachmentsPreview: Dispatch<SetStateAction<string[]>>;
  selectedAttachments: Blob[];
};

export const SelectedAttachmentsPreviewList = ({
  attachmentsPreview,
  setSelectedAttachments,
  setAttachmentsPreview,
  selectedAttachments,
}: PropTypes) => {
  const handleRemoveSelectedAttachment = (indexToBeRemoved: number) => {
    if (attachmentsPreview?.length === 1) setAttachmentsPreview([]);
    setSelectedAttachments(
      selectedAttachments?.filter((_, index) => index !== indexToBeRemoved)
    );
  };

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
