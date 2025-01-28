import { Attachment } from "@/interfaces/attachment.interface";
import { SharedMediaList } from "../attachments/SharedMediaList";

type PropTypes = {
  attachments: Attachment["attachments"] | undefined;
  totalAttachments:number | undefined;
};

export const SharedMedia = ({ attachments,totalAttachments }: PropTypes) => {

  return (
    <div className="flex flex-col gap-y-4">
      <p>
        {totalAttachments && totalAttachments > 0
          ? `Shared media ${totalAttachments}`
          : "No shared media"}
      </p>
      <SharedMediaList />
    </div>
  );
};
