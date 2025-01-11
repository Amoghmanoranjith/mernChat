import type { Message, UnreadMessage } from "./message.interface"

export interface ChatIntitalState {
    selectedChatId:string | null
    selectedChatDetails:ChatWithUnreadMessages | null
    filteredChats:ChatWithUnreadMessages[]
}

export interface ChatMember {
    _id:string
    username:string
    avatar:string
    isActive:boolean
    publicKey: string;
    lastSeen:Date
    verificationBadge:boolean
}


export interface ChatWithUnreadMessages {
    _id:string
    name?:string
    isGroupChat:boolean
    members:ChatMember[]
    avatar?:string
    admin:string
    unreadMessages:UnreadMessage
    seenBy:ChatMember[]
    userTyping:ChatMember[]
    latestMessage:Message
    createdAt:Date
}

export interface UserTypingEventReceiveData {
    chatId:string
    user:ChatMember
}

export interface NewMemberAddedEventPayloadData {
    chatId:string,
    members:ChatMember[]
}

export interface DeleteChatEventReceiveData {
    chatId:string
}
export interface MemberRemovedEventReceiveData extends DeleteChatEventReceiveData {
    membersId:string[]
}