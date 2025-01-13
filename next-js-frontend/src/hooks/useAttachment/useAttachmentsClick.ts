import { setAttachments } from "@/services/redux/slices/uiSlice";
import { useAppDispatch } from "@/services/redux/store/hooks";

type PropTypes = {
  attachments: string[];
};

export const useAttachmentsClick = ({ attachments }: PropTypes) => {
  const disptach = useAppDispatch();

  const handleAttachmentsClick = () => {
    disptach(setAttachments(attachments));
  };

  return { handleAttachmentsClick };
};
