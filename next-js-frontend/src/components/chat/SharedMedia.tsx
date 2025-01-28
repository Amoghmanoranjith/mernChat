import { SharedMediaList } from "../attachments/SharedMediaList";

type PropTypes = {
  totalAttachments: number ;
};

export const SharedMedia = ({ totalAttachments }: PropTypes) => {
  return (
    <div className="flex flex-col gap-y-4">
      <p> {totalAttachments > 0 ? `Shared media ${totalAttachments}` : "No shared media"} </p>
      <SharedMediaList />
    </div>
  );
};
