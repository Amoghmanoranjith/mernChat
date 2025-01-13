import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { Message } from "@/interfaces/message.interface";
import { MessageReactionListItem } from "./MessageReactionListItem";

type PropTypes = {
  reactions: Message["reactions"];
  loggedInUserId: string;
  messageId: string;
  selectedChatDetails: ChatWithUnreadMessages;
};

export const MessageReactionList = ({
  reactions,
  loggedInUserId,
  messageId,
  selectedChatDetails,
}: PropTypes) => {
  return (
    <div className="flex flex-col gap-y-2">
      {reactions.map((reaction, index) => (
        <MessageReactionListItem
          key={index}
          reaction={reaction}
          loggedInUserId={loggedInUserId}
          messageId={messageId}
          chatId={selectedChatDetails._id}
        />
      ))}
    </div>
  );
};
