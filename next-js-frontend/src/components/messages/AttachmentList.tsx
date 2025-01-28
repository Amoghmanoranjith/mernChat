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
      className={`${attachments.length == 1 ? "" : "grid grid-cols-2"} cursor-pointer`}>
      {attachments.map((attachment, index) => (
        <Image
          className="size-60 object-cover"
          src={attachment}
          key={index}
          alt="attachment"
          width={200}
          height={200}
        />
      ))}
    </div>
  );
};
