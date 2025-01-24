import { useAttachmentsClick } from "@/hooks/useAttachment/useAttachmentsClick";
import Image from "next/image";

type PropTypes = {
  attachments: string[];
};

export const AttachmentList = ({ attachments }: PropTypes) => {
  const { handleAttachmentsClick } = useAttachmentsClick({ attachments });
  return (
    <div
      onClick={handleAttachmentsClick}
      className={`${
        attachments.length == 1 ? "" : "grid grid-cols-2"
      } cursor-pointer`}
    >
      {attachments.map((attachment, index) => (
        <Image
          src={attachment}
          key={index}
          alt="attachment"
          width={60}
          height={60}
        />
      ))}
    </div>
  );
};
