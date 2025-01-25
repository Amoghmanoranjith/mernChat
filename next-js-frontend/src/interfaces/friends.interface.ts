import { ChatMember } from "./chat.interface"

export interface Friend extends ChatMember {
    createdAt:string;
}