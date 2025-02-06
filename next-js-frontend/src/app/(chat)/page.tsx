import { ChatAreaWrapper } from "@/components/chat/ChatAreaWrapper";
import { ChatDetailsLoaderWrapper } from "@/components/chat/ChatDetailsLoaderWrapper";
import { ChatDetailsWrapper } from "@/components/chat/ChatDetailsWrapper";
import { ChatHeaderWrapper } from "@/components/chat/ChatHeaderWrapper";
import { ChatListWithSearchInputWrapper } from "@/components/chat/ChatListWithSearchInputWrapper";
import { ChatListWrapper } from "@/components/chat/ChatListWrapper";
import { ChatWrapper } from "@/components/chat/ChatWrapper";
import { MessageInputAreaWrapper } from "@/components/messages/MessageInputAreaWrapper";
import { MessageListSkeletonWrapper } from "@/components/messages/MessageListSkeletonWrapper";
import { ServerDownMessage } from "@/components/ui/ServerDownMessage";
import { fetchUserChats, fetchUserFriendRequest, fetchUserFriends, fetchUserInfo } from "@/lib/server/services/userService";
import { cookies } from "next/headers";

export default async function ChatPage() {

  const loggedInUserId = (await cookies()).get("loggedInUserId")?.value as string || '';

  const [user,friends,friendRequest,chats] = await Promise.all([
    fetchUserInfo({loggedInUserId}),
    fetchUserFriends({loggedInUserId}),
    fetchUserFriendRequest({loggedInUserId}),
    fetchUserChats({loggedInUserId}),
  ]);

  console.log(chats);

  return (
    (friends && chats && friendRequest && user) ? (
    <ChatWrapper
      chats={chats}
      friendRequest={friendRequest}
      friends={friends}
      user={user}
    >
      <div className="h-full w-full flex p-4 max-md:p-2 gap-x-6 bg-background select-none">
        <ChatListWrapper>
          <ChatListWithSearchInputWrapper />
        </ChatListWrapper>
{/* 
        <ChatAreaWrapper>
          <div className="flex flex-col gap-y-3 h-full justify-between relative">
            <ChatHeaderWrapper />
            <MessageListSkeletonWrapper loggedInUserId={user.id} />
            <MessageInputAreaWrapper />
          </div>
        </ChatAreaWrapper> */}

        {/* <ChatDetailsWrapper>
          <ChatDetailsLoaderWrapper loggedInUser={user} />
        </ChatDetailsWrapper> */}
      </div>
    </ChatWrapper>
  )
  : 
  <ServerDownMessage/>
  );
}
