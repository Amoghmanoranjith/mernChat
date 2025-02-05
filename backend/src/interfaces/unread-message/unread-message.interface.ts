import { Types } from "mongoose";

export interface IUnreadMessage {
    user:Types.ObjectId
    chat:Types.ObjectId
    sender:Types.ObjectId
    message:Types.ObjectId
    readAt?:Date
    count:number
}


export interface IUnreadMessageEventPayload {
    chatId:string,
    message?:{
        content?:string | undefined | null
        url?:boolean | undefined | null
        attachments?:boolean
        poll?:boolean
        createdAt:Date
    },
    sender:{
        id:string,
        avatar:string,
        username:string
    }
}