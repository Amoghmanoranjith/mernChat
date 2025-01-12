import { User } from "@/interfaces/auth.interface";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === "object" && error != null && "status" in error;
};

const isErrorWithMessage = (
  error: unknown
): error is { status: number; data: { message: string } } => {
  return (
    typeof error === "object" &&
    error != null &&
    "data" in error &&
    typeof (error as any).data.message === "string"
  );
};

const printDraft = (data: unknown) => {
  console.log(JSON.parse(JSON.stringify(data)));
};

const base64ToArrayBuffer = (base64: any) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Convert Uint8Array to Base64
const uint8ArrayToBase64 = (array: any) => {
  return btoa(String.fromCharCode.apply(null, array));
};

// Convert Base64 to Uint8Array
const base64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const seconds = differenceInSeconds(now, date);
  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);
  const months = differenceInMonths(now, date);
  const years = differenceInYears(now, date);

  if (seconds < 60) {
    return seconds < 10 ? "just now" : `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 30) {
    return `${days}d ago`;
  } else if (months < 12) {
    return `${months}mo ago`;
  } else {
    return `${years}y ago`;
  }
};

const addHeaders = (token: string) => {
  return {
    headers: {
      Cookie: `token=${token}`,
    },
  };
};

const fetchUserFriends = async (token: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/friend",
    addHeaders(token)
  );
  if (response.ok) {
    const friends = await response.json();
    return friends;
  }
};

const fetchUserChats = async (token: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/chat",
    addHeaders(token)
  );
  if (response.ok) {
    const chats = await response.json();
    return chats;
  }
};

const fetchUserFriendRequest = async (token: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/request",
    addHeaders(token)
  );
  if (response.ok) {
    const friendRequest = await response.json();
    return friendRequest;
  }
};

const getLoggedInUserFromHeaders = (headers: ReadonlyHeaders): User => {
  return JSON.parse(headers.get("x-logged-in-user") as string);
};

const getChatName = (
  selectedChatDetails: ChatWithUnreadMessages | null,
  loggedInUserId: User["_id"] | undefined | null
) => {
  let chatName = "N/A";
  if(selectedChatDetails?.isGroupChat){
    chatName = selectedChatDetails.name as string;
  }
  else{
    chatName = getOtherMemberOfPrivateChat(selectedChatDetails as ChatWithUnreadMessages, loggedInUserId as string)?.username as string;
  }
  return chatName.length > 16 ? chatName.substring(0, 16) + "..." : chatName;
};

const getChatAvatar = (
  selectedChatDetails: ChatWithUnreadMessages | null,
  loggedInUserId: User["_id"] | null | undefined
) => {
  return selectedChatDetails?.isGroupChat
    ? selectedChatDetails.avatar
    : selectedChatDetails?.members.filter(
        (member) => member._id !== loggedInUserId
      )[0]?.avatar;
};

const sortChats = (chats: ChatWithUnreadMessages[]) => {
  return [...chats].sort((a, b) => {
    // First, we compare the unread message counts for both chats
    // The purpose is to show the chat with more unread messages at the top
    // If chat 'b' has more unread messages than chat 'a', the comparison returns a positive number, moving 'b' higher in the list
    // If chat 'a' has more unread messages than chat 'b', the comparison returns a negative number, moving 'a' higher in the list
    if (b.unreadMessages.count !== a.unreadMessages.count) {
      // Sorting in descending order, so we subtract 'a' unread count from 'b' unread count
      return b.unreadMessages.count - a.unreadMessages.count;
    } else {
      // If the unread message counts are the same, we move to the next sorting criteria:
      // We compare the timestamp of the latest messages to display the most recent one at the top

      // Get the timestamp of the latest message in chat 'a' or the createdAt timestamp if latestMessage is undefined
      const aTime = new Date(
        a.latestMessage?.createdAt || a.createdAt
      ).getTime();

      // Get the timestamp of the latest message in chat 'b' or the createdAt timestamp if latestMessage is undefined
      const bTime = new Date(
        b.latestMessage?.createdAt || b.createdAt
      ).getTime();

      // The comparison here is again in descending order
      // If 'b' has a more recent message, the comparison returns a positive number and 'b' moves higher in the list
      // If 'a' has a more recent message, the comparison returns a negative number and 'a' moves higher in the list
      return bTime - aTime;
    }
  });
};

const getAppropriateLastLatestMessageForGroupChats = (
  latestMessage: ChatWithUnreadMessages["latestMessage"]
) => {
  return latestMessage.isPoll
    ? "Sent a poll"
    : latestMessage.url
    ? "Sent a gif"
    : latestMessage.attachments?.length
    ? "Sent an attachment"
    : latestMessage.content?.length
    ? (latestMessage.content.length>25 ? latestMessage.content.substring(0, 25) + "..." : latestMessage.content)
    : null;
};

const getAppropriateLastLatestMessageForPrivateChats = (
  latestMessage: ChatWithUnreadMessages["latestMessage"]
) => {
  return latestMessage.isPoll
    ? "Sent a poll"
    : latestMessage.url
    ? "Sent a gif"
    : latestMessage.attachments?.length
    ? "Sent an attachment"
    : null;
};

const getAppropriateUnreadMessageForGroupChats = (
  unreadMessage: ChatWithUnreadMessages["unreadMessages"]
) => {
  return unreadMessage.message?.poll
    ? "Sent a poll"
    : unreadMessage.message?.url
    ? "Sent a gif"
    : unreadMessage.message?.attachments
    ? "Sent an attachment"
    : unreadMessage.message?.content
    ? (unreadMessage.message.content.length>25 ? unreadMessage.message.content.substring(0, 25) + "..." : unreadMessage.message.content)
    : null;
};

const getAppropriateUnreadMessageForPrivateChats = (
  unreadMessage: ChatWithUnreadMessages["unreadMessages"]
) => {
  return unreadMessage.message?.poll
    ? "Sent a poll"
    : unreadMessage.message?.url
    ? "Sent a gif"
    : unreadMessage.message?.attachments
    ? "Sent an attachment"
    : null;
};

const getOtherMemberOfPrivateChat = (
  chat: ChatWithUnreadMessages,
  loggedInUserId: string
) => {
  return chat?.members.filter((member) => member._id !== loggedInUserId)[0];
};

const getOtherMembersOfGroupChatThatAreActive = (
  chat: ChatWithUnreadMessages,
  loggedInUserId: string
) => {
  return chat.members.filter(
    (member) => member._id !== loggedInUserId && member.isActive
  );
};

export {
  base64ToArrayBuffer,
  base64ToUint8Array,
  fetchUserChats,
  fetchUserFriendRequest,
  fetchUserFriends,
  formatRelativeTime,
  getAppropriateLastLatestMessageForGroupChats,
  getAppropriateLastLatestMessageForPrivateChats,
  getAppropriateUnreadMessageForGroupChats,
  getAppropriateUnreadMessageForPrivateChats,
  getChatAvatar,
  getChatName,
  getLoggedInUserFromHeaders,
  getOtherMemberOfPrivateChat,
  getOtherMembersOfGroupChatThatAreActive,
  isErrorWithMessage,
  isFetchBaseQueryError,
  printDraft,
  sortChats,
  uint8ArrayToBase64,
};
