import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { ChatListItem } from "./ChatListItem";
import { sortChats } from "@/utils/helpers";

type PropTypes = {
  chats: ChatWithUnreadMessages[];
  loggedInUserId: string;
};

export const ChatList = ({ chats, loggedInUserId }: PropTypes) => {
  const sortedChats = sortChats(chats);

  return (
    <>
      <div className="flex flex-col gap-y-4">
        {sortedChats.map((chat) => (
          <ChatListItem key={chat._id} chat={chat} loggedInUserId={loggedInUserId}/>
        ))}
      </div>
    </>
  );
};
