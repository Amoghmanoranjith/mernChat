import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import {
  getAppropriateLastLatestMessageForGroupChats,
  getAppropriateLastLatestMessageForPrivateChats,
  getAppropriateUnreadMessageForGroupChats,
  getAppropriateUnreadMessageForPrivateChats,
} from "@/utils/helpers";
import { TypingIndicatorAnimation } from "../ui/TypingIndicatorAnimation";
import { DisplayDecryptedMessage } from "../messages/DisplayDecryptedMessage";

type PropTypes = {
  chat: ChatWithUnreadMessages;
};

export const ChatListItemSecondaryInfo = ({ chat }: PropTypes) => {
  const renderHelper = () => {
    if (chat.userTyping.length) {
      // if any user is typing
      // then show typing indicator animation
      return (
        <div className="w-12">
          <TypingIndicatorAnimation />
        </div>
      );
    } else if (chat.unreadMessages.count === 0) {
      // that means are no unread messages
      // so we will display the last latest message of the conversation

      if (chat.isGroupChat) {
        // if it is a group chat
        // then messages are not in encrypted format
        // so if there is a gif we can show "sent a gif" or for attachments "sent an attachment" and so on
        // and for text messages we can direclty show the message right?
        return (
          <span className="text-sm text-secondary-darker">
            {getAppropriateLastLatestMessageForGroupChats(chat.latestMessage)}
          </span>
        );
      } else {
        // if is is not a group chat
        // then for last latest text messages we have to decrypt the message, then only we can show that
        // as in private chats E2EE(end-to-end-enncrytion) is applied
        if (chat.latestMessage.content?.length) {
          // here we will decrypt the message and then show it
          return <DisplayDecryptedMessage cipherText={chat.latestMessage.content} chat={chat}/>
        } else {
          // but if the latest message is not a text message
          // we can our utility function to get the appropriate message
          return (
            <span className="text-sm text-secondary-darker">
              {getAppropriateLastLatestMessageForPrivateChats(
                chat.latestMessage
              )}
            </span>
          );
        }
      }
    } else {
      // if there are unread messages
      // then we cannot show the latest message as we have to show the latest unread message
      // again there are two cases
      if (chat.isGroupChat) {
        // if it is group chat
        // then we can just simply use our utility function to get the appropriate message
        // and text messages are not encrypted in group chats
        return (
          <span className="text-sm text-secondary-darker">
            {getAppropriateUnreadMessageForGroupChats(chat.unreadMessages)}
          </span>
        );
      } else {
        // if it is not a group chat
        // and the unreadMessage is a textMessage then we have to decrypt the message first as private chats are E2EE
        if (chat.unreadMessages.message.content?.length) {
          // here will have to decrypt the message
          // and then only we can show it
          return <DisplayDecryptedMessage cipherText={chat.unreadMessages.message.content} chat={chat}/>
        } else {
          // but if the unread message is not a text message
          // then we can use our utility function to get the appropriate message
          return (
            <span className="text-sm text-secondary-darker">
              {getAppropriateUnreadMessageForPrivateChats(chat.unreadMessages)}
            </span>
          );
        }
      }
    }
  };

  return (
    <>
      {renderHelper()}
      {chat.unreadMessages?.count > 0 && (
        <p className="bg-primary flex items-center justify-center text-white rounded-full h-5 w-5 p-2">
          {chat.unreadMessages?.count}
        </p>
      )}
    </>
  );
};
