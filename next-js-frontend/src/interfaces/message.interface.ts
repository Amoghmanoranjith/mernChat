import { ChatMember } from "./chat.interface"

export interface PollOption {
    option:string,
    votes:ChatMember[]
}

export interface Message {
    _id:string
    content?:string
    sender:{
        _id:string
        username:string
        avatar:string
    }
    chat:string
    url?:string
    isEdited?:boolean
    attachments?:Array<string> | []
    isPoll?:boolean
    pollQuestion?:string
    pollOptions?:PollOption[]
    reactions:Array<{user:Pick<ChatMember, '_id' | 'username' | 'avatar'>,emoji:string}>,
    isMultipleAnswers?:boolean
    createdAt:Date
    updatedAt:Date
    isNew?:boolean
}

export interface UnreadMessage {
    count:number
    message:{
        content?:string
        url?:boolean
        attachments?:boolean
        poll?:boolean,
        createdAt:Date
    },
    sender:ChatMember
}

export interface MessageEventPayloadData {
    chat:string
    content?:string | ArrayBuffer
    url?:string
    isPoll?:boolean
    pollQuestion?:string
    pollOptions?:Array<{option:string,votes:Array<string>}>
    isMultipleAnswers?:boolean
}

export interface MessageSeenEventPayloadData {
    chatId:string
}

export interface MessageSeenEventReceiveData {
    chat:string,
    user:ChatMember
    readAt:Date
}

export interface UnreadMessageEventReceiveData {
    chatId:string
    message:UnreadMessage["message"]
    sender:ChatMember
}

export interface EditMessageEventPayloadData {
    messageId:string,
    updatedContent:string,
    chatId:string
}

export interface EditMessageEventReceiveData {
    _id: string
    chat: string
    content: string
    isEdited: boolean
}

export interface VoteInEventPayloadData {
    chatId:string
    messageId:string
    optionIndex:number
}

export interface VoteInEventReceiveData {
    _id:string
    user:ChatMember
    optionIndex:number
}

export interface IVoteOutEventReceiveData extends Omit<VoteInEventReceiveData,'user'> {
    user:Pick<ChatMember , '_id'>
}

export interface INewReactionEventReceiveData {
    chatId:string
    messageId:string
    user:Pick<ChatMember, '_id' | 'username' | 'avatar'>
    emoji:string
}

export interface DeleteReactionEventReceiveData {
    chatId:string
    messageId:string
    userId:string
}

export interface NewReactionEventPayloadData {
    chatId:string,
    messageId:string,
    reaction:string
}

export interface UserTypingEventPayloadData extends MessageSeenEventPayloadData {}
export interface VoteOutEventPayloadData extends VoteInEventPayloadData {}