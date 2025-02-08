import { Message } from "@/interfaces/message.interface";
import { fetchUserChatsResponse } from "@/lib/server/services/userService";
import { Gif } from "../ui/Gif";
import { AttachmentList } from "./AttachmentList";
import { PollCard } from "./PollCard";
import { TextMessage } from "./TextMessage";

type PropTypes = {
  message: Message;
  loggedInUserId: string;
  selectedChatDetails: fetchUserChatsResponse;
  editMessageId: string | undefined;
  setEditMessageId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpenContextMenuMessageId: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
};

export const RenderAppropriateMessage = ({
  message,
  editMessageId,
  setEditMessageId,
  setOpenContextMenuMessageId,
  loggedInUserId,
  selectedChatDetails,
}: PropTypes) => {
  return (
    <>
      {selectedChatDetails.isGroupChat &&
        loggedInUserId != message.sender.id && (
          <p className="text-primary-dark font-medium">
            {message.sender.username}
          </p>
        )}
      {message.isPollMessage && (
        <PollCard key={message.poll?.votes.length} messageId={message.id} pollData={message.poll!}/>
      )}
      {message.attachments.length > 0 && (
        <AttachmentList attachments={message.attachments} />
      )}
      {message.url && <Gif url={message.url} />}
      {message.isTextMessage && (
        <TextMessage
          cipherText={message.textMessageContent!}
          editMessageId={editMessageId}
          loggedInUserId={loggedInUserId}
          messageId={message.id}
          selectedChatDetails={selectedChatDetails}
          setEditMessageId={setEditMessageId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
        />
      )}
    </>
  );
};
