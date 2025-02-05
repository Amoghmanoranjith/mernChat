import { User } from "@/interfaces/auth.interface";
import { ChatWithUnreadMessages } from "@/interfaces/chat.interface";
import { PollOption } from "@/interfaces/message.interface";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

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

const base64ToArrayBuffer = (base64: any) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Function to convert a Uint8Array (byte array) to a Base64-encoded string
const uint8ArrayToBase64 = (array: any) => {
  
  // `String.fromCharCode(...array)` is used to convert each byte in the Uint8Array to its corresponding character.
  // The spread operator `...` unpacks the individual byte values of the array and passes them as individual arguments to `String.fromCharCode`.
  // `String.fromCharCode` converts each of these byte values (in the range 0-255) into a corresponding character in the string.
  // Example: If the byte array is [72, 101, 108, 108, 111], it converts to the string "Hello".
  const str = String.fromCharCode(...array);
  
  // `btoa` is used to encode the string into Base64 format.
  // Base64 encoding takes binary data (in the form of a string) and converts it into an ASCII string representation 
  // that uses only readable characters (A-Z, a-z, 0-9, +, /, and = for padding).
  // This encoded string can be safely stored or transmitted over systems that only support text-based data.
  // For example: "Hello" becomes "SGVsbG8=" after Base64 encoding.
  return btoa(str);
};


// Function to convert a Base64-encoded string to a Uint8Array (byte array)
const base64ToUint8Array = (base64: string) => {
  // Step 1: Decode the Base64 string back into a binary string
  // `atob` takes a Base64-encoded string and decodes it into a binary string.
  // Each character in the binary string represents a single byte (8 bits) of the original binary data.
  const binaryString = atob(base64);

  // Step 2: Get the length of the binary string
  // The length of the binary string corresponds to the number of bytes in the original data.
  const len = binaryString.length;

  // Step 3: Create a Uint8Array with the same length as the binary string
  // A Uint8Array is used to store the byte values of the binary data. Each element in the array represents one byte.
  const bytes = new Uint8Array(len);

  // Step 4: Loop through each character in the binary string
  for (let i = 0; i < len; i++) {
    // `binaryString.charCodeAt(i)` gets the Unicode value (0–255) of the character at index `i`.
    // Since the binary string was decoded from Base64, each character corresponds to one byte of data.
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Step 5: Return the Uint8Array
  // The Uint8Array now contains the byte representation of the original data encoded in the Base64 string.
  return bytes;
};


const formatRelativeTime = (stringDate: string | Date) => {
  try {
    let date:Date 
    if(typeof stringDate === "string"){
      date = JSON.parse(stringDate) as Date;
    }
    else{
      date = stringDate
    }
    if(!date) return 'N/A';
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
    
  } catch (error) {
    console.log(error);
  }
};

const getChatName = (
  selectedChatDetails: ChatWithUnreadMessages | null,
  loggedInUserId: User["id"] | undefined | null
) => {
  let chatName = "N/A";
  if(selectedChatDetails && selectedChatDetails?.isGroupChat){
    chatName = selectedChatDetails.name as string;
  }
  else{
    chatName = getOtherMemberOfPrivateChat(selectedChatDetails as ChatWithUnreadMessages, loggedInUserId as string)?.username as string;
  }
  return chatName?.length > 16 ? chatName?.substring(0, 16) + "..." : chatName;
};

const getChatAvatar = (
  selectedChatDetails: ChatWithUnreadMessages | null,
  loggedInUserId: User["id"] | null | undefined
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
  return latestMessage?.isPoll
    ? "Sent a poll"
    : latestMessage?.url
    ? "Sent a gif"
    : latestMessage?.attachments?.length
    ? "Sent an attachment"
    : latestMessage?.content?.length
    ? (latestMessage.content.length>25 ? latestMessage.content.substring(0, 25) + "..." : latestMessage.content)
    : null;
};

const getAppropriateLastLatestMessageForPrivateChats = (
  latestMessage: ChatWithUnreadMessages["latestMessage"]
) => {
  return latestMessage?.isPoll
    ? "Sent a poll"
    : latestMessage?.url
    ? "Sent a gif"
    : latestMessage?.attachments?.length
    ? "Sent an attachment"
    : null;
};

const getAppropriateUnreadMessageForGroupChats = (
  unreadMessage: ChatWithUnreadMessages["unreadMessages"]
) => {
  return unreadMessage?.message?.poll
    ? "Sent a poll"
    : unreadMessage?.message?.url
    ? "Sent a gif"
    : unreadMessage?.message?.attachments
    ? "Sent an attachment"
    : unreadMessage?.message?.content
    ? (unreadMessage.message.content.length>25 ? unreadMessage.message.content.substring(0, 25) + "..." : unreadMessage.message.content)
    : null;
};

const getAppropriateUnreadMessageForPrivateChats = (
  unreadMessage: ChatWithUnreadMessages["unreadMessages"]
) => {
  return unreadMessage?.message?.poll
    ? "Sent a poll"
    : unreadMessage?.message?.url
    ? "Sent a gif"
    : unreadMessage?.message?.attachments
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

const haveUserVotedThisOption = (option:PollOption,loggedInUserId:string)=>{
  return option.votes.findIndex(vote=>vote._id===loggedInUserId)!==-1
}

export {
  base64ToArrayBuffer,
  base64ToUint8Array,
  formatRelativeTime,
  getAppropriateLastLatestMessageForGroupChats,
  getAppropriateLastLatestMessageForPrivateChats,
  getAppropriateUnreadMessageForGroupChats,
  getAppropriateUnreadMessageForPrivateChats,
  getChatAvatar,
  getChatName,
  getOtherMemberOfPrivateChat,
  getOtherMembersOfGroupChatThatAreActive, haveUserVotedThisOption, isErrorWithMessage,
  isFetchBaseQueryError,
  sortChats,
  uint8ArrayToBase64
};

