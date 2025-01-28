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
    if(indexToBeRemoved==0){
      setSelectedAttachments([]);
    }
    else{
      setSelectedAttachments(
        selectedAttachments?.filter((_, index) => index !== indexToBeRemoved)
      );
    }
  };

  return { handleRemoveSelectedAttachment };
};
