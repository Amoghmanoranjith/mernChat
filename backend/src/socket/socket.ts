import { Prisma } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { Events } from "../enums/event/event.enum.js";
import { userSocketIds } from "../index.js";
import { prisma } from "../lib/prisma.lib.js";
import { deleteFilesFromCloudinary, uploadAudioToCloudinary, uploadEncryptedAudioToCloudinary } from "../utils/auth.util.js";
import { sendPushNotification } from "../utils/generic.js";
import registerWebRtcHandlers from "./webrtc/socket.js";
import { UploadApiResponse } from "cloudinary";

type MessageEventReceivePayload = {
    chatId:string
    isPollMessage:boolean
    textMessageContent?:string | ArrayBuffer
    encryptedAudio?:Uint8Array<ArrayBuffer>
    audio?:Uint8Array<ArrayBuffer>
    url?:string
    pollData?:{
        pollQuestion?:string
        pollOptions?:string[]
        isMultipleAnswers?:boolean
    }
}


type UnreadMessageEventSendPayload = {
    chatId:string,
    message?:{
        textMessageContent?:string | undefined | null
        url?:boolean | undefined | null
        attachments?:boolean
        poll?:boolean
        createdAt:Date
        audio?:boolean
    },
    sender:{
        id:string,
        avatar:string,
        username:string
    }
}

type MessageSeenEventReceivePayload = {
    chatId:string
}

type MessageSeenEventSendPayload = {
    user:{
        id:string
        username:string
        avatar:string
    },
    chatId:string,
    readAt:Date
}

type MessageEditEventReceivePayload = {
    chatId:string
    messageId:string
    updatedTextContent:string
}

type MessageEditEventSendPayload = {
    chatId:string
    messageId:string
    updatedTextMessageContent:string
}

type MessageDeleteEventReceivePayload = {
    chatId:string
    messageId:string
}

type MessageDeleteEventSendPayload  = MessageDeleteEventReceivePayload

type NewReactionEventReceivePayload = {
    chatId:string
    messageId:string
    reaction:string
}

type NewReactionEventSendPayload = {
    chatId:string
    messageId:string
    user:{
        id:string
        username:string
        avatar:string
    }
    reaction:string
}

type DeleteReactionEventReceivePayload = {
    chatId:string
    messageId:string
}

type DeleteReactionEventSendPayload = {
    chatId:string
    messageId:string
    userId:string
}

type UserTypingEventReceivePayload = {
    chatId:string
}

type UserTypingEventSendPayload = {
    user:{
        id:string
        username:string
        avatar:string
    },
    chatId:string
}

type VoteInEventReceivePayload = {
    chatId:string
    messageId:string
    optionIndex:number
}

type VoteInEventSendPayload = {
    messageId:string
    user:{
        id:string
        avatar:string
        username:string
    }
    optionIndex:number,
    chatId:string
}

type VoteOutEventReceivePayload = VoteInEventReceivePayload

type VoteOutEventSendPayload = {
    chatId:string
    messageId:string
    userId:string
    optionIndex:number
}

type OfflineUserEventSendPayload = {
    userId:string
}

type OnlineUserEventSendPayload = OfflineUserEventSendPayload

type OnlineUsersListEventSendPayload = {
    onlineUserIds:string[]
}

const registerSocketHandlers = (io:Server)=>{
    
    io.on("connection",async(socket:Socket)=>{

        console.log(socket.user.username,"connected");

        await prisma.user.update({
            where:{id:socket.user.id},
            data:{isOnline:true}
        })

        userSocketIds.set(socket.user.id,socket.id)
        
        // telling everyone that user is online
        const payload:OnlineUserEventSendPayload = {
            userId:socket.user.id
        }
        socket.broadcast.emit(Events.ONLINE_USER,payload)
        
        // getting all other online users
        const onlineUserIds = Array.from(userSocketIds.keys());

        // sending the online users to the user who just connected
        let payloadOnlineUsers:OnlineUsersListEventSendPayload = {
            onlineUserIds,
        }
        socket.emit(Events.ONLINE_USERS_LIST, payloadOnlineUsers);

        // getting all chats of the user
        const userChats = await prisma.chatMembers.findMany({
            where:{
                userId:socket.user.id
            },
            select:{chatId:true}
        })
        
        // joining the user to all of its chats via chatIds (i.e rooms)
        const chatIds = userChats.map(({chatId})=>chatId);
        socket.join(chatIds)

        socket.on(Events.MESSAGE,async({chatId,isPollMessage,pollData,textMessageContent,url,encryptedAudio,audio}:MessageEventReceivePayload)=>{
            
            let newMessage:Partial<Prisma.MessageCreateInput>

            if(audio){
                const uploadResult =  await uploadAudioToCloudinary({buffer:audio}) as UploadApiResponse | undefined;
                if(!uploadResult) return;
                newMessage = await prisma.message.create({
                    data:{
                        senderId:socket.user.id,
                        chatId:chatId,
                        isTextMessage:false,
                        isPollMessage:false,
                        audioPublicId:uploadResult.public_id,
                        audioUrl:uploadResult.secure_url
                    },
                })
            }

            else if(encryptedAudio){
                const uploadResult = ( await uploadEncryptedAudioToCloudinary({buffer:encryptedAudio})) as UploadApiResponse | undefined;
                if(!uploadResult) return;
                
                newMessage = await prisma.message.create({
                    data:{
                        senderId:socket.user.id,
                        chatId:chatId,
                        isTextMessage:false,
                        isPollMessage:false,
                        audioPublicId:uploadResult.public_id,
                        audioUrl:uploadResult.secure_url
                    },
                })
            
            }
            
            else if(isPollMessage && pollData?.pollOptions && pollData.pollQuestion){

                const newPoll =  await prisma.poll.create({
                    data:{
                        question:pollData.pollQuestion,
                        options:pollData.pollOptions,
                        multipleAnswers:pollData.isMultipleAnswers ? pollData.isMultipleAnswers : false
                    }
                })

                newMessage = await prisma.message.create({
                    data:{
                        senderId:socket.user.id,
                        chatId:chatId,
                        pollId:newPoll.id,
                        isPollMessage:true,
                        isTextMessage:false,
                    },
                })
            }
            else if(url){
                newMessage = await prisma.message.create({
                    data:{
                        senderId:socket.user.id,
                        chatId:chatId,
                        url,
                        isPollMessage:false,
                        isTextMessage:false,
                    },
                })
            }
            else{
                newMessage =  await prisma.message.create({
                    data:{
                        senderId:socket.user.id,
                        chatId:chatId,
                        isPollMessage:false,
                        isTextMessage:true,
                        textMessageContent:textMessageContent as string,
                    },
                })
            }

            const currentChat =  await prisma.chat.update({
                where:{id:chatId},
                data:{latestMessageId:newMessage.id},
                include:{
                    ChatMembers:{
                        select:{
                            user:{
                                select:{
                                    id:true,
                                    isOnline:true,
                                    notificationsEnabled:true,
                                    fcmToken:true,
                                }
                            }
                        }
                    }
                }
            })

            const message = await prisma.message.findUnique({
                where:{chatId:chatId,id:newMessage.id},
                include:{
                    sender:{
                      select:{
                        id:true,
                        username:true,
                        avatar:true,
                      }
                    },
                    attachments:{
                      select:{
                        secureUrl:true,
                      }
                    },
                    poll:{
                      omit:{
                        id:true,
                      },
                      include:{
                        votes:{
                          include:{
                            user:{
                              select:{
                                id:true,
                                username:true,
                                avatar:true
                              }
                            }
                          },
                          omit:{
                            id:true,
                            pollId:true,
                            userId:true,
                          }
                        },
                      }
                    },
                    reactions:{
                      select:{
                        user:{
                          select:{
                            id:true,
                            username:true,
                            avatar:true
                          }
                        },
                        reaction:true,
                      }
                    },
                  },
                omit:{
                    senderId:true,
                    pollId:true,
                    audioPublicId:true,
                },
            })
            
            io.to(chatId).emit(Events.MESSAGE,{...message,isNew:true})

            const currentChatMembers = currentChat.ChatMembers.filter(({user:{id}})=>id!=socket.user.id)
            
            const updateOrCreateUnreadMessagePromises = currentChatMembers.map(async(member)=>{

                if(!member.user.isOnline && member.user.notificationsEnabled && member.user.fcmToken){
                    sendPushNotification({fcmToken:member.user.fcmToken,body:`New message from ${socket.user.username}`})
                }
    
                const isExistingUnreadMessage = await prisma.unreadMessages.findUnique({
                    where:{
                        userId_chatId:{
                            userId:member.user.id,
                            chatId:chatId
                        }
                    }
                })
    
                if(isExistingUnreadMessage){
                    return prisma.unreadMessages.update({
                        where:{
                            userId_chatId:{
                                userId:member.user.id,
                                chatId:chatId
                            }
                        },
                        data:{
                            count:{
                                increment:1
                            },
                            messageId:newMessage.id
                        }
                    })
                }
                else{
                    return prisma.unreadMessages.create({
                        data:{
                            userId:member.user.id,
                            chatId:chatId,
                            count:1,
                            senderId:socket.user.id,
                            messageId:newMessage.id!
                        }
                    })
                }
            })

            await Promise.all(updateOrCreateUnreadMessagePromises)
    
            const unreadMessagePayload:UnreadMessageEventSendPayload = {
                chatId:chatId,
                message:{
                    textMessageContent:newMessage.isTextMessage ? newMessage.textMessageContent : undefined,
                    url:newMessage.url ? true : false,
                    attachments:false,
                    poll:newMessage.isPollMessage ? true : false,
                    audio:newMessage.audioPublicId ? true : false,
                    createdAt:newMessage.createdAt as Date
                },
                sender:{
                    id:socket.user.id,
                    avatar:socket.user.avatar!,
                    username:socket.user.username
                }
            }
    
            io.to(chatId).emit(Events.UNREAD_MESSAGE,unreadMessagePayload)
        })

        socket.on(Events.MESSAGE_SEEN,async({chatId}:MessageSeenEventReceivePayload)=>{

            const doesUnreadMessageExists =  await prisma.unreadMessages.findUnique({
                where:{
                    userId_chatId:{
                        userId:socket.user.id,
                        chatId,
                    }
                }
            })
            
            if(!doesUnreadMessageExists) return;
            const unreadMessageData = await prisma.unreadMessages.update({
                where:{
                    id:doesUnreadMessageExists.id
                },
                data:{
                    count:0,
                    readAt:new Date
                }
            })

            const payload:MessageSeenEventSendPayload = {
                user:{
                    id:socket.user.id,
                    username:socket.user.username,
                    avatar:socket.user.avatar
                },
                chatId,
                readAt:unreadMessageData.readAt!,
            }
            io.to(chatId).emit(Events.MESSAGE_SEEN,payload)
        })

        socket.on(Events.MESSAGE_EDIT,async({chatId,messageId,updatedTextContent}:MessageEditEventReceivePayload)=>{
            
            const message =  await prisma.message.update({
                where:{
                    chatId,
                    id:messageId
                },
                data:{
                    textMessageContent:updatedTextContent,
                    isEdited:true,
                }
            })

            const payload:MessageEditEventSendPayload = {
                updatedTextMessageContent:message.textMessageContent!,
                chatId,
                messageId
            }

            io.to(chatId).emit(Events.MESSAGE_EDIT,payload)
        })

        socket.on(Events.MESSAGE_DELETE,async({chatId,messageId}:MessageDeleteEventReceivePayload)=>{

            const deletedMessage =  await prisma.message.delete({
                where:{
                    chatId:chatId,
                    id:messageId
                },
                select:{
                    id:true,
                    attachments:true,
                }
            })

            if(deletedMessage.attachments.length) {
                const attachmentPublicIds = deletedMessage.attachments.map(({cloudinaryPublicId})=>cloudinaryPublicId);
                await deleteFilesFromCloudinary({publicIds:attachmentPublicIds})                
            }

            if(deletedMessage.id){
                const payload:MessageDeleteEventSendPayload = {
                    messageId:deletedMessage.id,
                    chatId,
                }
                io.to(chatId).emit(Events.MESSAGE_DELETE,payload)
            }
        })
        
        socket.on(Events.NEW_REACTION,async({chatId,messageId,reaction}:NewReactionEventReceivePayload)=>{
            
            const result =  await prisma.reactions.findFirst({
                where:{
                    userId:socket.user.id,
                    messageId
                }
            })

            if(result) return;

            await prisma.reactions.create({
                data:{
                    reaction,
                    userId:socket.user.id,
                    messageId,
                }
            })

            const payload:NewReactionEventSendPayload = {
                chatId,
                messageId,
                user:{
                    id:socket.user.id,
                    username:socket.user.username,
                    avatar:socket.user.avatar
                },
                reaction,
            }

            io.to(chatId).emit(Events.NEW_REACTION,payload)

        })

        socket.on(Events.DELETE_REACTION,async({chatId,messageId}:DeleteReactionEventReceivePayload)=>{

            await prisma.reactions.deleteMany({
                where:{
                    userId:socket.user.id,
                    messageId
                }
            })
            const payload:DeleteReactionEventSendPayload = {
                chatId,
                messageId,
                userId:socket.user.id 
            }
            io.to(chatId).emit(Events.DELETE_REACTION,payload)
        })

        socket.on(Events.USER_TYPING,({chatId}:UserTypingEventReceivePayload)=>{

            const payload:UserTypingEventSendPayload = {
                user:{
                    id:socket.user.id,
                    username:socket.user.username,
                    avatar:socket.user.avatar
                },
                chatId:chatId,
            }

            socket.broadcast.to(chatId).emit(Events.USER_TYPING,payload)
        })

        socket.on(Events.VOTE_IN,async({chatId,messageId,optionIndex}:VoteInEventReceivePayload)=>{
            
            const isValidPoll = await prisma.message.findFirst({
                where:{chatId,id:messageId},
                include:{
                    poll:{
                        select:{
                            id:true
                        }
                    }
                }
            })

            if(!isValidPoll?.poll?.id) return 
            
            await prisma.vote.create({
                data:{
                    pollId:isValidPoll.poll.id,
                    userId:socket.user.id,
                    optionIndex
                }
            })

            const payload:VoteInEventSendPayload = {
                messageId,
                optionIndex,
                user:{
                    id:socket.user.id,
                    avatar:socket.user.avatar,
                    username:socket.user.username
                },
                chatId
            }
            io.to(chatId).emit(Events.VOTE_IN,payload)
        })

        socket.on(Events.VOTE_OUT,async({chatId,messageId,optionIndex}:VoteOutEventReceivePayload)=>{
           
            const isValidPoll = await prisma.message.findFirst({
                where:{chatId,id:messageId},
                include:{
                    poll:{
                        select:{
                            id:true
                        }
                    }
                },
            })

            if(!isValidPoll?.poll?.id) return

            const vote =  await prisma.vote.findFirst({
                where:{
                    userId:socket.user.id,
                    pollId:isValidPoll.poll.id,
                    optionIndex
                }
            })

            if(!vote) return;

            await prisma.vote.deleteMany({
                where: {
                    userId:socket.user.id,
                    pollId:isValidPoll.poll.id,
                    optionIndex
                }
            });         
            const payload:VoteOutEventSendPayload = {
                chatId,
                messageId,
                optionIndex,
                userId:socket.user.id
            }
            io.to(chatId).emit(Events.VOTE_OUT,payload)
        })

        registerWebRtcHandlers(socket,io);

        socket.on("disconnect",async()=>{

            await prisma.user.update({
                where:{
                    id:socket.user.id
                },
                data:{
                    isOnline:false,
                    lastSeen:new Date
                }
            })
            userSocketIds.delete(socket.user.id);

            const payload:OfflineUserEventSendPayload = {
                userId:socket.user.id
            }
            socket.broadcast.emit(Events.OFFLINE_USER,payload)
        })
})
}

export default registerSocketHandlers
