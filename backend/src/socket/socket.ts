import { Types } from "mongoose";
import { Server } from "socket.io";
import { Events } from "../enums/event/event.enum.js";
import { userSocketIds } from "../index.js";
import { AuthenticatedSocket, IUser } from "../interfaces/auth/auth.interface.js";
import { IDeleteReactionEventPayloadData, IMessage, INewReactionEventPayloadData } from "../interfaces/message/message.interface.js";
import { IUnreadMessageEventPayload } from "../interfaces/unread-message/unread-message.interface.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { UnreadMessage } from "../models/unread-message.model.js";
import { User } from "../models/user.model.js";
import { deleteFilesFromCloudinary } from "../utils/auth.util.js";
import { sendPushNotification } from "../utils/generic.js";


const registerSocketHandlers = (io:Server)=>{io.on("connection",async(socket:AuthenticatedSocket)=>{

    await User.findByIdAndUpdate(socket.user?._id,{isActive:true})

    userSocketIds.set(socket.user?._id.toString(),socket.id)

    socket.broadcast.emit(Events.ONLINE,socket.user?._id)

    const onlineUserIds = Array.from(userSocketIds.keys());
    socket.emit(Events.ONLINE_USERS, onlineUserIds);

    const userChats = await Chat.find({"members":socket.user?._id},{"_id":1})
    const chatIds = userChats.map(userChat=>userChat._id.toString())
    socket.join(chatIds)


    socket.on(Events.MESSAGE,async({chat,content,url,isPoll,pollQuestion,pollOptions,isMultipleAnswers}:Omit<IMessage , "sender" | "chat" | "attachments"> & {chat:string})=>{

        // save to db
        const newMessage = await Message.create({chat,content,sender:socket.user?._id,url,isPoll,pollQuestion,pollOptions,isMultipleAnswers})
        await Chat.findByIdAndUpdate(chat,{latestMessage:newMessage._id})
        
        const transformedMessage  = await Message.aggregate([
            {
                $match:{
                    chat:new Types.ObjectId(chat),
                    _id:newMessage._id
                }
            },
            {
                $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                    $addFields: {
                        avatar: "$avatar.secureUrl",
                    },
                    },
                    {
                    $project: {
                        username: 1,
                        avatar: 1,
                    },
                    },
                ],
                },
            },
            {
                $addFields: {
                    sender: {
                        $arrayElemAt: ["$sender", 0],
                    },
                },
            },
            {
                $addFields: {
                    "attachments":"$attachments.secureUrl"
                },
            },
            {
                $unwind:{
                    path:"$pollOptions",
                    preserveNullAndEmptyArrays:true,
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"pollOptions.votes",
                    foreignField:"_id",
                    as:"pollOptions.votes",
                    pipeline:[
                        {
                            $project:{
                                username:1,
                                avatar:"$avatar.secureUrl"
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                  _id: "$_id",  // Group by the original message _id
                  sender: { $first: "$sender" },  // Keep the first sender object
                  chat: { $first: "$chat" },  // Keep the first chat ID
                  isPoll: { $first: "$isPoll" },  // Keep the first isPoll flag
                  content:{$first:'$content'},
                  url:{$first:'$url'},
                  pollQuestion: { $first: "$pollQuestion" }, // Keep the first pollQuestion
                  pollOptions: {
                    $push: "$pollOptions"  // Push each unwound pollOption into the array
                  },
                  isMultipleAnswers: { $first: "$isMultipleAnswers" },
    
                  attachments: { $first: "$attachments" },  // Keep the first attachments array (optional)
                  createdAt: { $first: "$createdAt" },  // Keep the first createdAt timestamp
                  updatedAt: { $first: "$updatedAt" },  // Keep the first updatedAt timestamp
                }
            },
            {
                $sort:{
                    'createdAt':1
                }
            }
        ])

        io.to(chat).emit(Events.MESSAGE,{...transformedMessage[0],isNew:true,reactions:[]})

        // Handle unread messages for receivers
        const currentChat = await Chat.findById(chat,{members:1,_id:1}).populate<{members:Array<IUser>}>('members')
        
        if(currentChat){
            const currentChatMembers = currentChat.members.filter(member=>member._id.toString()!==socket.user?._id.toString())
            
            const updateOrCreateUnreadMessagePromise = currentChatMembers.map(async(member)=>{

                if(!member.isActive && member.notificationsEnabled && member.fcmToken){
                    sendPushNotification({fcmToken:member.fcmToken,body:`New message from ${socket.user?.username}`})
                }
    
                const isExistingUnreadMessage = await UnreadMessage.findOne({chat,user:member._id})
    
                if(isExistingUnreadMessage){
                    isExistingUnreadMessage.count+=1
                    isExistingUnreadMessage.message = newMessage._id
                    isExistingUnreadMessage.save()
                    return isExistingUnreadMessage
                }
    
               return UnreadMessage.create({chat,user:member._id,sender:socket.user?._id,message:newMessage._id})
    
            })

            await Promise.all(updateOrCreateUnreadMessagePromise)
    
            const messageData:IUnreadMessageEventPayload['message'] = {createdAt:newMessage.createdAt}

    
            if(newMessage.isPoll){
                messageData.poll=true
            }
            
            if(newMessage.url){
                messageData.url=true
            }
    
            if(newMessage.content?.length){
                messageData.content=newMessage.content
            }

            const unreadMessageData:IUnreadMessageEventPayload = {
                chatId:chat,
                message:messageData,
                sender:transformedMessage[0].sender
            }
    
            io.to(chat).emit(Events.UNREAD_MESSAGE,unreadMessageData)
        }

    })

    socket.on(Events.MESSAGE_SEEN,async({chatId}:{chatId:string})=>{

        const areUnreadMessages = await UnreadMessage.findOne({chat:chatId,user:socket.user?._id})   

        if(areUnreadMessages){
            areUnreadMessages.count=0
            areUnreadMessages.readAt=new Date()
            await areUnreadMessages.save()
        }

        io.to(chatId).emit(Events.MESSAGE_SEEN,{
            user:{
                _id:socket.user?._id,
                username:socket.user?.username,
                avatar:socket.user?.avatar?.secureUrl
            },
            chat:chatId,
            readAt:areUnreadMessages?.readAt,
        })

    })

    socket.on(Events.MESSAGE_EDIT,async({messageId,updatedContent,chatId}:{messageId:string,updatedContent:string,chatId:string})=>{
        
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            {isEdited:true,content:updatedContent},
            {new:true,projection:['chat','content','isEdited']}
        )

        io.to(chatId).emit(Events.MESSAGE_EDIT,updatedMessage)
    })

    socket.on(Events.MESSAGE_DELETE,async({messageId}:{messageId:string})=>{

        const deletedMessage = await Message.findByIdAndDelete(messageId)

        if(deletedMessage?.attachments?.length) {
            await deleteFilesFromCloudinary(deletedMessage.attachments.map(attachment=>attachment.publicId))
        }

        if(deletedMessage){
            io.to(deletedMessage.chat._id.toString()).emit(Events.MESSAGE_DELETE,{messageId,chatId:deletedMessage.chat._id.toString()})
        }
    })
    
    socket.on(Events.NEW_REACTION,async({chatId,messageId,reaction}:{chatId:string,messageId:string,reaction:string})=>{
        
        await Message.findOneAndUpdate(
            {_id:messageId,chat:chatId},
            {$addToSet:{reactions:{user:socket.user?._id,emoji:reaction}}},
        )
        
        const payload:INewReactionEventPayloadData = {
            chatId,
            messageId,
            user:{
                _id:socket.user?._id.toString()!,
                username:socket.user?.username!,
                avatar:socket.user?.avatar?.secureUrl!
            },
            emoji:reaction,
        }

        io.to(chatId).emit(Events.NEW_REACTION,payload)

    })

    socket.on(Events.DELETE_REACTION,async({chatId,messageId}:{chatId:string,messageId:string})=>{

        await Message.findOneAndUpdate(
            {_id:messageId,chat:chatId},
            {$pull:{reactions:{user:socket.user?._id}}},
        )

        const paylaod:IDeleteReactionEventPayloadData = {
            chatId,
            messageId,
            userId:socket.user?._id.toString()! 
        }

        io.to(chatId).emit(Events.DELETE_REACTION,paylaod)
    })

    socket.on(Events.USER_TYPING,({chatId}:{chatId:string})=>{
        socket.broadcast.to(chatId).emit(Events.USER_TYPING,{
            user:{
                _id:socket.user?._id.toString(),
                username:socket.user?.username,
                avatar:socket.user?.avatar?.secureUrl
            },
            chatId:chatId
        })
    })

    socket.on(Events.VOTE_IN,async({chatId,messageId,optionIndex}:{chatId:string,messageId:string,optionIndex:number})=>{
        
        const message = await Message.findOneAndUpdate(
            { chat: chatId, _id: messageId },
            {"$addToSet":{[`pollOptions.${optionIndex}.votes`]:socket.user?._id}},
            { new: true ,projection:["chat","_id"]}
        )
        
        const userInfo = {
            _id:socket.user?._id,
            avatar:socket.user?.avatar?.secureUrl,
            username:socket.user?.username
        }
        
        const payload = {
            _id:message?._id,
            optionIndex,
            user:userInfo
        }

        io.to(chatId).emit(Events.VOTE_IN,payload)

    })

    socket.on(Events.VOTE_OUT,async({chatId,messageId,optionIndex}:{chatId:string,messageId:string,optionIndex:number})=>{
        
        const message = await Message.findOneAndUpdate(
            { chat: chatId, _id: messageId },
            {"$pull":{[`pollOptions.${optionIndex}.votes`]:socket.user?._id}},
            { new: true ,projection:["chat","_id"]}
        )
        
        const userInfo = {
            _id:socket.user?._id,
        }
        
        const payload = {
            _id:message?._id,
            optionIndex,
            user:userInfo
        }

        io.to(chatId).emit(Events.VOTE_OUT,payload)

    })

    socket.on("disconnect",async()=>{
        await User.findByIdAndUpdate(socket.user?._id,{isActive:false,lastSeen:new Date})
        userSocketIds.delete(socket.user?._id);
        socket.broadcast.emit(Events.OFFLINE,socket.user?._id)
    })
})
}

export default registerSocketHandlers
