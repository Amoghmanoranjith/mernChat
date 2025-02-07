import { useDeleteMessage } from "@/hooks/useMessages/useDeleteMessage";
import { DeleteIcon } from "../ui/icons/DeleteIcon";
import { EditIcon } from "../ui/icons/EditIcon";

type PropTypes = {
  setOpenContextMenuMessageId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>;
  messageId: string;
};

export const ContextMenuOptions = ({
  setEditMessageId,
  setOpenContextMenuMessageId,
  messageId,
}: PropTypes) => {
  const { deleteMessage } = useDeleteMessage();

  return (
    <div
      className={`flex flex-col bg-secondary-dark text-text p-2 rounded-2xl shadow-2xl min-w-32 self-end`}
    >
      <div className="flex flex-col">
        <div
          onClick={() => {
            setOpenContextMenuMessageId(undefined);
            setEditMessageId(messageId);
          }}
          className="cursor-pointer p-2 rounded-sm hover:bg-secondary-darker flex items-center justify-between"
        >
          <p>Edit</p>
          <span>
            <EditIcon />
          </span>
        </div>
        <div
          onClick={() => deleteMessage({ messageId })}
          className="cursor-pointer p-2 rounded-sm hover:bg-secondary-darker flex items-center justify-between"
        >
          <p>Unsend</p>
          <span>
            <DeleteIcon />
          </span>
        </div>
      </div>
    </div>
  );
};
