import { useMessageInputRef } from "@/context/message-input-ref.context";
import { useGetMessagesByChatIdQuery } from "@/lib/client/rtk-query/message.api";
import { selectSelectedChatDetails } from "@/lib/client/slices/chatSlice";
import { setReplyingToMessageData, setReplyingToMessageId } from "@/lib/client/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/client/store/hooks";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { useCallback } from "react";
import { EditIcon } from "../ui/icons/EditIcon";
import { ReplyIcon } from "../ui/icons/ReplyIcon";

type PropTypes = {
  setOpenContextMenuMessageId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>;
  messageId: string;
  isTextMessage:boolean;
  isAttachmentMessage:boolean;
  myMessage: boolean;
};

export const ContextMenuOptions = ({
  setEditMessageId,
  setOpenContextMenuMessageId,
  messageId,
  isTextMessage,
  isAttachmentMessage,
  myMessage
}: PropTypes) => {
  // const { deleteMessage } = useDeleteMessage();
  const dispatch = useAppDispatch();

  const ref =  useMessageInputRef();


  const selectedChatDetails =  useAppSelector(selectSelectedChatDetails) as fetchUserChatsResponse;

  const { message } = useGetMessagesByChatIdQuery({chatId:selectedChatDetails.id,page:1},{
    selectFromResult:({data})=>({
      message: data?.messages.find(msg=>msg.id === messageId)
    })
  })
  
  const handleReplyClick = useCallback(()=>{
    if(ref && ref.current){
      ref.current.focus();
      dispatch(setReplyingToMessageData((message?.attachments && message.attachments.length > 0) ? "Replying to Attachment" : message?.isTextMessage ? `Replying to "${(message?.decryptedMessage as string).length > 100 ? (message?.decryptedMessage as string).substring(0,100)+"...":(message?.decryptedMessage as string).substring(0,100)}"` : message?.audioUrl ? " Replying to Voice Note" : message?.isPollMessage ? "Replying to Poll" : message?.url ? 'Replying to Gif' : "n/a"));
      dispatch(setReplyingToMessageId(messageId));
      setOpenContextMenuMessageId(undefined)
    }
  },[dispatch, message?.audioUrl, message?.decryptedMessage, message?.isPollMessage, message?.isTextMessage, message?.url, messageId, ref, setOpenContextMenuMessageId])

  return (
    <div className={`flex flex-col bg-secondary-dark text-text p-2 rounded-2xl shadow-2xl min-w-32 self-end`}>
      <div className="flex flex-col">
        {
          (myMessage && (isTextMessage || isAttachmentMessage)) &&
          <div
            onClick={() => {
              setOpenContextMenuMessageId(undefined);
              setEditMessageId(messageId);
            }}
            className="cursor-pointer p-2 rounded-sm hover:bg-secondary-darker flex items-center justify-between"
          >
            <p>{isAttachmentMessage ? "Caption" : "Edit"}</p>
            <span>
              <EditIcon />
            </span>
          </div>
        }
        <div
            onClick={handleReplyClick}
            className="cursor-pointer p-2 rounded-sm hover:bg-secondary-darker flex items-center justify-between"
          >
            <span>Reply</span>
            <span>
              <ReplyIcon/>
            </span>
          </div>
        {/* <div
          onClick={() => deleteMessage({ messageId })}
          className="cursor-pointer p-2 rounded-sm hover:bg-secondary-darker flex items-center justify-between"
        >
          <p>Unsend</p>
          <span>
            <DeleteIcon />
          </span>
        </div> */}
      </div>
    </div>
  );
};
