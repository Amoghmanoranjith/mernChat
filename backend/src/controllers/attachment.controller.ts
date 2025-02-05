import { NextFunction, Response } from "express";
import { Server } from "socket.io";
import { ACCEPTED_FILE_MIME_TYPES } from "../constants/file.constant.js";
import { Events } from "../enums/event/event.enum.js";
import { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { IUnreadMessageEventPayload } from "../interfaces/unread-message/unread-message.interface.js";
import { prisma } from "../lib/prisma.lib.js";
import { uploadAttachmentSchemaType } from "../schemas/message.schema.js";
import { uploadFilesToCloudinary } from "../utils/auth.util.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { calculateSkip } from "../utils/generic.js";
import { emitEventToRoom } from "../utils/socket.util.js";

export const uploadAttachment = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    if(!req.files?.length){
        return next(new CustomError("Please provide the files",400))
    }

    const {chatId}:uploadAttachmentSchemaType = req.body

    if(!chatId){
        return next(new CustomError("ChatId is required",400))
    }

    const isExistingChat = await prisma.chat.findUnique({
        where:{
            id:chatId
        },
        include:{
            members:{
                select:{
                    id:true,
                }
            }
        }
    })

    if(!isExistingChat){
        return next(new CustomError("Chat not found",404))
    }

    const attachments = req.files as Express.Multer.File[]

    const invalidFiles = attachments.filter(file=>!ACCEPTED_FILE_MIME_TYPES.includes(file.mimetype))
    
    if(invalidFiles.length) {
        const invalidFileNames = invalidFiles.map(file => file.originalname).join(', ');
        return next(new CustomError(`Unsupported file types: ${invalidFileNames}, please provide valid files`, 400));
    }

    const uploadResults =  await uploadFilesToCloudinary({files:attachments})

    if(!uploadResults){
        return next(new CustomError("Failed to upload files",500))
    }

    const attachmentsArray = uploadResults.map(({secureUrl,publicId})=>({cloudinaryPublicId:publicId,secureUrl}))

    const newMessage =  await prisma.message.create({
        data:{
            chatId:chatId,
            senderId:req.user.id,
            attachments:{
                create:attachmentsArray
            }
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

    const io:Server = req.app.get("io");
    emitEventToRoom({data:newMessage,event:Events.MESSAGE,io,room:chatId})

    const otherMembersOfChat = isExistingChat.members.filter(({ id }) => req.user.id !== id);

    const updateOrCreateUnreadMessagePromises = otherMembersOfChat.map(({ id }) => {
        return prisma.unreadMessages.upsert({
          where: {
            userId_chatId: { userId: id, chatId: chatId }, // Using the unique composite key
          },
          update: {
            count: { increment: 1 },
            senderId: req.user.id,
          },
          create: {
            userId: id,
            chatId,
            count: 1,
            senderId: req.user.id,
            messageId: newMessage.id,
          },
        });
    });
      
    await Promise.all(updateOrCreateUnreadMessagePromises);

    const unreadMessageData:IUnreadMessageEventPayload = 
    {
        chatId,
        message:{
            attachments:newMessage.attachments.length ? true : false,
            createdAt:newMessage.createdAt
        },
        sender:{
            _id:newMessage.sender.id,
            avatar:newMessage.sender.avatar,
            username:newMessage.sender.avatar
        }
    }

    emitEventToRoom({data:unreadMessageData,event:Events.UNREAD_MESSAGE,io,room:chatId})
    return res.status(201)

})

export const fetchAttachments = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id} = req.params
    const { page = 1, limit = 6 } = req.query;

    const attachments = await prisma.attachment.findMany({
      where:{
        message:{
          chatId:id,
        }
      },
      omit:{
        messageId:true,
        cloudinaryPublicId:true,
      },
      orderBy:{
        message:{
          createdAt:"asc"
        }
      },
      skip:calculateSkip(Number(page),Number(limit)),
      take:Number(limit)
    })

    const totalAttachmentsCount = await prisma.attachment.count({
        where:{
            message:{
                chatId:id
            }
        }
    })
    
    const totalPages =  Math.ceil(totalAttachmentsCount/Number(limit))

    const payload = {
      attachments,
      totalAttachmentsCount,
      totalPages,
    }
    
    res.status(200).json(payload);
    
})