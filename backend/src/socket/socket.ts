import { Prisma } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { Events } from "../enums/event/event.enum.js";
import { userSocketIds } from "../index.js";
import { IDeleteReactionEventPayloadData, IMessage } from "../interfaces/message/message.interface.js";
import { IUnreadMessageEventPayload } from "../interfaces/unread-message/unread-message.interface.js";
import { prisma } from "../lib/prisma.lib.js";
import { deleteFilesFromCloudinary } from "../utils/auth.util.js";
import { sendPushNotification } from "../utils/generic.js";


const registerSocketHandlers = (io:Server)=>{
    
    io.on("connection",async(socket:Socket)=>{

        prisma.user.update({
            where:{id:socket.user.id},
            data:{isOnline:true}
        })

        userSocketIds.set(socket.user.id,socket.id)
        
        // telling everyone that user is online
        socket.broadcast.emit(Events.ONLINE,socket.user.id)
        
        // getting all other online users
        const onlineUserIds = Array.from(userSocketIds.keys());

        // sending the online users to the user who just connected
        socket.emit(Events.ONLINE_USERS, onlineUserIds);

        // getting all chats of the user
        const userChats = await prisma.chat.findMany({
            where:{members:{some:{id:socket.user.id}}},
            select:{id:true}
        })
        
        // joining the user to all of its chats via chatIds (i.e rooms)
        const chatIds = userChats.map(({id})=>id);
        socket.join(chatIds)

        socket.on(Events.MESSAGE,async({chat,content,url,isPoll,pollQuestion,pollOptions,isMultipleAnswers}:Omit<IMessage , "sender" | "chat" | "attachments"> & {chat:string})=>{
            
            let newMessage:Partial<Prisma.MessageCreateInput>
            
            if(isPoll && pollQuestion && pollOptions && pollOptions?.length){
                const newPoll =  await prisma.poll.create({
                    data:{
                        question:pollQuestion,
                        options:pollOptions,
                        multipleAnswers:isMultipleAnswers ? isMultipleAnswers : false
                    }
                })

                newMessage = await prisma.message.create({
                    data:{
                        senderId:socket.user.id,
                        chatId:chat,
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
                        chatId:chat,
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
                        chatId:chat,
                        isPollMessage:false,
                        isTextMessage:true,
                        textMessageContent:content,
                    },
                })
            }

            const currentChat =  await prisma.chat.update({
                where:{
                    id:chat
                },
                data:{
                    latestMessageId:newMessage.id
                },
                include:{
                    members:{
                        select:{
                            id:true,
                            isOnline:true,
                            notificationsEnabled:true,
                            fcmToken:true,
                        }
                    }
                }
            })

            const message = await prisma.message.findUnique({
                where:{
                chatId:chat,
                id:newMessage.id
                },
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
                senderId:false,
                },
            })
            
            io.to(chat).emit(Events.MESSAGE,{...message,isNew:true,reactions:[]})


            const currentChatMembers = currentChat.members.filter(({id})=>id!=socket.user.id)
            
            const updateOrCreateUnreadMessagePromises = currentChatMembers.map(async(member)=>{

                if(!member.isOnline && member.notificationsEnabled && member.fcmToken){
                    sendPushNotification({fcmToken:member.fcmToken,body:`New message from ${socket.user.username}`})
                }
    
                const isExistingUnreadMessage = await prisma.unreadMessages.findUnique({
                    where:{
                        userId_chatId:{
                            userId:member.id,
                            chatId:chat
                        }
                    }
                })
    
                if(isExistingUnreadMessage){
                    return prisma.unreadMessages.update({
                        where:{
                            userId_chatId:{
                                userId:member.id,
                                chatId:chat
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
                            userId:member.id,
                            chatId:chat,
                            count:1,
                            senderId:socket.user.id,
                            messageId:newMessage.id!
                        }
                    })
                }
    
            })

            await Promise.all(updateOrCreateUnreadMessagePromises)
    
            const unreadMessagePayload:IUnreadMessageEventPayload = {
                chatId:chat,
                message:{
                    content:newMessage.isTextMessage ? newMessage.textMessageContent : undefined,
                    url:newMessage.url ? true : false,
                    attachments:false,
                    poll:newMessage.isPollMessage ? true : false,
                    createdAt:newMessage.createdAt as Date
                },
                sender:{
                    id:socket.user.id,
                    avatar:socket.user.avatar!,
                    username:socket.user.username
                }
            }
    
            io.to(chat).emit(Events.UNREAD_MESSAGE,unreadMessagePayload)
        })

        socket.on(Events.MESSAGE_SEEN,async({chatId}:{chatId:string})=>{
            
            const unreadMessageData = await prisma.unreadMessages.update({
                where:{
                    userId_chatId:{
                        userId:socket.user.id,
                        chatId,
                    }
                },
                data:{
                    count:0,
                    readAt:new Date
                }
            })

            const payload = {
                user:{
                    id:socket.user.id,
                    username:socket.user.username,
                    avatar:socket.user.avatar
                },
                chatId,
                readAt:unreadMessageData.readAt,
            }
            io.to(chatId).emit(Events.MESSAGE_SEEN,payload)
        })

        socket.on(Events.MESSAGE_EDIT,async({messageId,updatedContent,chatId}:{messageId:string,updatedContent:string,chatId:string})=>{
            
            const message =  await prisma.message.update({
                where:{
                    chatId,
                    id:messageId
                },
                data:{
                    textMessageContent:updatedContent,
                    isEdited:true,
                }
            })

            io.to(chatId).emit(Events.MESSAGE_EDIT,message.textMessageContent)
        })

        socket.on(Events.MESSAGE_DELETE,async({messageId,chatId}:{messageId:string,chatId:string})=>{

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
                io.to(chatId).emit(Events.MESSAGE_DELETE,{messageId:deletedMessage.id,chatId:chatId})
            }
        })
        
        socket.on(Events.NEW_REACTION,async({chatId,messageId,reaction}:{chatId:string,messageId:string,reaction:string})=>{
            
            await prisma.reactions.create({
                data:{
                    reaction,
                    userId:socket.user.id,
                    messageId,
                }
            })

            const payload = {
                chatId,
                messageId,
                user:{
                    id:socket.user.id,
                    username:socket.user.username,
                    avatar:socket.user.avatar
                },
                emoji:reaction,
            }

            io.to(chatId).emit(Events.NEW_REACTION,payload)

        })

        socket.on(Events.DELETE_REACTION,async({chatId,messageId}:{chatId:string,messageId:string})=>{

            await prisma.reactions.delete({
                where:{
                    userId_messageId:{
                        userId:socket.user.id,
                        messageId
                    }
                }
            })
            const payload:IDeleteReactionEventPayloadData = {
                chatId,
                messageId,
                userId:socket.user.id 
            }
            io.to(chatId).emit(Events.DELETE_REACTION,payload)
        })

        socket.on(Events.USER_TYPING,({chatId}:{chatId:string})=>{
            const payload = {
                user:{
                    id:socket.user.id,
                    username:socket.user.username,
                    avatar:socket.user.avatar
                },
                chatId:chatId
            }
            socket.broadcast.to(chatId).emit(Events.USER_TYPING,payload)
        })

        socket.on(Events.VOTE_IN,async({chatId,messageId,optionIndex}:{chatId:string,messageId:string,optionIndex:number})=>{
            
            const isValidPoll = await prisma.message.findFirst({
                where:{AND:[{chatId},{id:messageId}]},
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
            
            const userInfo = {
                _id:socket.user.id,
                avatar:socket.user.avatar,
                username:socket.user.username
            }

            const payload = {
                _id:messageId,
                optionIndex,
                user:userInfo
            }
            io.to(chatId).emit(Events.VOTE_IN,payload)
        })

        socket.on(Events.VOTE_OUT,async({chatId,messageId,optionIndex}:{chatId:string,messageId:string,optionIndex:number})=>{
            
            const isValidPoll = await prisma.message.findFirst({
                where:{AND:[{chatId},{id:messageId}]},
                include:{
                    poll:{
                        select:{
                            id:true
                        }
                    }
                },
            })
            if(!isValidPoll?.poll?.id) return
            await prisma.vote.deleteMany({
                where: {
                    userId: socket.user.id,
                    pollId: isValidPoll.poll.id
                }
            });         
            const payload = {
                _id:messageId,
                optionIndex,
                user:socket.user.id
            }
            io.to(chatId).emit(Events.VOTE_OUT,payload)
        })

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
            socket.broadcast.emit(Events.OFFLINE,socket.user.id)
        })
})
}

export default registerSocketHandlers
