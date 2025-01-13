import { useEffect, useState } from "react";

type PropTypes = {
  selectedAttachments: Blob[];
};
export const useGenerateAttachmentsPreview = ({
  selectedAttachments,
}: PropTypes) => {
  const [attachmentsPreview, setAttachmentsPreview] = useState<string[]>([]);

  useEffect(() => {
    if (selectedAttachments.length) {
      setAttachmentsPreview(
        selectedAttachments.map((attachment) => URL.createObjectURL(attachment))
      );
    }
    return () => {
      attachmentsPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedAttachments]);

  return { attachmentsPreview};
};
