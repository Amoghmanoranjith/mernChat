import { ChatMember } from "./chat.interface"

export interface FriendRequest {
    _id:string
    sender:ChatMember
    status:"Pending" | "Accepted" | "Rejected"
    createdAt:Date
}