import { ChatAreaWrapper } from "@/components/chat/ChatAreaWrapper";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatListWithSearchInputWrapper } from "@/components/chat/ChatListWithSearchInputWrapper";
import { ChatListWrapper } from "@/components/chat/ChatListWrapper";
import { ChatWrapper } from "@/components/chat/ChatWrapper";
import { MessageForm } from "@/components/chat/MessageForm";
import { MessageFromWrapper } from "@/components/messages/MessageFromWrapper";
import { MessageListWrapper } from "@/components/messages/MessageListWrapper";
import {
  fetchUserChats,
  fetchUserFriendRequest,
  fetchUserFriends,
  getLoggedInUserFromHeaders,
} from "@/utils/helpers";
import { cookies, headers } from "next/headers";

export default async function ChatPage() {
  const [headerList, cookieList] = await Promise.all([
    await headers(),
    await cookies(),
  ]);
  const user = getLoggedInUserFromHeaders(headerList);
  const token = cookieList.get("token")?.value as string;

  const [friends, chats, friendRequest] = await Promise.all([
    fetchUserFriends(token),
    fetchUserChats(token),
    fetchUserFriendRequest(token),
  ]);

  return (
    <ChatWrapper
      chats={chats}
      friendRequest={friendRequest}
      friends={friends}
      user={user}
    >
      <div className="h-full w-full flex p-4 max-md:p-2 gap-x-6 bg-background select-none">
        <ChatListWrapper>
          <ChatListWithSearchInputWrapper/>
        </ChatListWrapper>

        <ChatAreaWrapper>
          <div className="flex flex-col gap-y-3 h-full justify-between relative">
            <ChatHeader loggedInUserId={user._id} />
            <MessageListWrapper loggedInUserId={user._id} />
            <MessageFromWrapper>
              <MessageForm />
            </MessageFromWrapper>
          </div>
        </ChatAreaWrapper>
      </div>
    </ChatWrapper>
  );
}
