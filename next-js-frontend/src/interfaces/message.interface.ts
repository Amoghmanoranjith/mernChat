import { ChatMember } from "@/lib/server/services/userService";

export interface PollOption {
    option:string,
    votes:ChatMember[]
}

export interface Message {
    sender: {
        id: string;
        username: string;
        avatar: string;
    };
    attachments: {
        secureUrl: string;
    }[];
    poll:{
        votes: {
            user: {
                id: string;
                username: string;
                avatar: string;
            };
            optionIndex: number;
        }[];
        question: string;
        options: string[];
        multipleAnswers: boolean;
    } | null;
    reactions: {
        user: {
            id: string;
            username: string;
            avatar: string;
        };
        reaction: string;
    }[];
    id: string;
    isTextMessage: boolean;
    textMessageContent: string | null;
    senderId: string;
    chatId: string;
    url: string | null;
    pollId: string | null;
    isPollMessage: boolean;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
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

export interface EditMessageEventPayloadData {
    messageId:string,
    updatedContent:string,
    chatId:string
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

export interface VoteOutEventReceiveData extends Omit<VoteInEventReceiveData,'user'> {
    user:Pick<ChatMember , 'id'>
}

export interface NewReactionEventReceiveData {
    chatId:string
    messageId:string
    user:Pick<ChatMember, 'id' | 'username' | 'avatar'>
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

export type UserTypingEventPayloadData = MessageSeenEventPayloadData
export type VoteOutEventPayloadData = VoteInEventPayloadData