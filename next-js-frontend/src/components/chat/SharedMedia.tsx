import { Attachment } from "@/interfaces/attachment.interface";
import { SharedMediaList } from "../attachments/SharedMediaList";

type PropTypes = {
  attachments: Attachment["attachments"] | undefined;
  selectedChatId: string;
};

export const SharedMedia = ({ attachments }: PropTypes) => {
  const attachmentsLength = attachments?.length;

  return (
    <div className="flex flex-col gap-y-4">
      <p>
        {attachmentsLength && attachmentsLength > 0
          ? `Shared media ${attachmentsLength}`
          : "No shared media"}
      </p>
      <SharedMediaList />
    </div>
  );
};
