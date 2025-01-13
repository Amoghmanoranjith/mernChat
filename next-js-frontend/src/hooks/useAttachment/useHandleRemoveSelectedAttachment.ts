import { Dispatch, SetStateAction } from "react";

type PropTypes = {
  setSelectedAttachments: Dispatch<SetStateAction<Blob[]>>;
  selectedAttachments: Blob[];
};

export const useHandleRemoveSelectedAttachment = ({
  setSelectedAttachments,
  selectedAttachments,
}: PropTypes) => {
  const handleRemoveSelectedAttachment = (indexToBeRemoved: number) => {
    setSelectedAttachments(
      selectedAttachments?.filter((_, index) => index !== indexToBeRemoved)
    );
  };

  return { handleRemoveSelectedAttachment };
};
