import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { Message } from "@/interfaces/message.interface";
import { Gif } from "../ui/Gif";
import { AttachmentList } from "./AttachmentList";
import { PollCard } from "./PollCard";
import { TextMessage } from "./TextMessage";

type PropTypes = {
  message: Message;
  loggedInUserId: string;
  selectedChatDetails: ChatWithUnreadMessages;
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
        loggedInUserId != message.sender._id && (
          <p className="text-primary-dark font-medium">
            {message.sender.username}
          </p>
        )}
      {message.isPoll && message.pollQuestion &&  (
        <PollCard
          isMutipleAnswers={message?.isMultipleAnswers ? true : false}
          messageId={message._id}
          question={message.pollQuestion}
          options={message.pollOptions}
        />
      )}
      {message.attachments && (
        <AttachmentList attachments={message.attachments} />
      )}
      {message.url && <Gif url={message.url} />}
      {message.content && (
        <TextMessage
          cipherText={message.content}
          editMessageId={editMessageId}
          loggedInUserId={loggedInUserId}
          messageId={message._id}
          selectedChatDetails={selectedChatDetails}
          setEditMessageId={setEditMessageId}
          setOpenContextMenuMessageId={setOpenContextMenuMessageId}
        />
      )}
    </>
  );
};
