import { NextFunction, Response } from "express";
import type { AuthenticatedRequest, IUser } from "../interfaces/auth/auth.interface.js";
import { Request } from "../models/request.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import type { createRequestSchemaType, handleRequestSchemaType } from "../schemas/request.schema.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { emitEvent, emitEventToRoom } from "../utils/socket.util.js";
import { Events } from "../enums/event/event.enum.js";
import { addUnreadMessagesAndSpectatorStage, populateMembersStage } from "./chat.controller.js";
import { Friend } from "../models/friend.model.js";
import { userSocketIds } from "../index.js";
import { sendPushNotification } from "../utils/generic.js";


const requestPipeline = [
  {
      $project:{
          receiver:0,
          updatedAt:0
      }
  },
  {
    $lookup: {
      from: "users",
      localField: "sender",
      foreignField: "_id",
      as: "sender",
      pipeline:[
        {
          $addFields:{
            avatar:"$avatar.secureUrl"
          }
        },
        {
          $project:{
            username:1,
            avatar:1
          }
        },
      ]
    }
  },
  {
    $addFields: {
      "sender": {
        $arrayElemAt:["$sender",0]
      }
    }
  }
]

const getUserRequests = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const requests = await Request.aggregate([
        {
          $match:{
            receiver: req.user?._id
          }
        }
        ,...requestPipeline
      ])

    return res.status(200).json(requests)
})

const createRequest = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {receiver}:createRequestSchemaType = req.body

    const isValidReceiverId = await User.findById(receiver)

    if(!isValidReceiverId){
        return next(new CustomError("Receiver not found",404))
    }

    if(req.user?._id.toString() === receiver){
        return next(new CustomError("You cannot send a request to yourself",400))
    }

    const isAlreadyCreated = await Request.findOne({receiver,sender:req.user?._id})

    if(isAlreadyCreated){
        return next(new CustomError("Request is already sent",400))
    }

    const doesRequestExistsFromReceiver = await Request.findOne({receiver:req.user?._id,sender:receiver})

    if(doesRequestExistsFromReceiver){
      return next(new CustomError("They have already sent you a request",400))
    }

    const areAlreadyFriends = await Friend.findOne({user:req.user?._id,friend:receiver})

    if(areAlreadyFriends){
      return next(new CustomError("You are already friends"))
    }

    const newRequest = await Request.create({receiver,sender:req.user?._id})

    if(!isValidReceiverId.isActive && isValidReceiverId?.fcmToken && isValidReceiverId.notificationsEnabled){
      sendPushNotification({fcmToken:isValidReceiverId.fcmToken,body:`${req.user?.username} sent you a friend request`})
    }

    const transformedRequest = await Request.aggregate([

      {
        $match:{
          _id:newRequest._id
        }
      },
      ...requestPipeline
    ])

    emitEvent(req,Events.NEW_FRIEND_REQUEST,[receiver],transformedRequest[0])

    return res.status(201).json()

})

const handleRequest = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id}=req.params
    const {action}:handleRequestSchemaType = req.body

    const isExistingRequest = await Request.findById(id).populate<{sender:Pick<IUser,'_id' | 'fcmToken' | 'isActive' | 'notificationsEnabled'>}>("sender",{fcmToken:1,isActive:1,notificationsEnabled:1})

    if(!isExistingRequest){
        return next(new CustomError("Request not found",404))
    }

    if(isExistingRequest.receiver._id.toString() !== req.user?._id.toString()){
        return next(new CustomError("Only the receiver of this request can accept or reject it",401))
    }

    if(action==='accept'){

        const members = [isExistingRequest.sender,isExistingRequest.receiver]
        const newChat = await Chat.create({members})

        await Friend.insertMany([
          {user:isExistingRequest.receiver,friend:isExistingRequest.sender},
          {user:isExistingRequest.sender,friend:isExistingRequest.receiver}
        ])

        if(isExistingRequest.sender.notificationsEnabled && !isExistingRequest.sender.isActive && isExistingRequest.sender?.fcmToken){
          sendPushNotification({fcmToken:isExistingRequest.sender.fcmToken,body:`${req.user.username} has accepted your friend request 😃`})
        }

        const transformedChat =  await Chat.aggregate([
          {
            $match:{
              _id:newChat._id
            }
          },
          populateMembersStage,
          addUnreadMessagesAndSpectatorStage
        ])

        // now will use the two members id, that are part of this chat
        // and will use their _id to get their socketId from the userSocketIds object (Map)
        // and will join them to the chat room i.e their created chat._id
        // so that they can listen to the events
        // that are broadcasted to this chat room
        const member1SocketId = userSocketIds.get(isExistingRequest.sender._id.toString());
        const member2SocketId = userSocketIds.get(isExistingRequest.receiver._id.toString());
        const chatId = newChat._id.toString();
        const io = req.app.get('io');

        if (member1SocketId) {
          const member1Socket = io.sockets.sockets.get(member1SocketId);
          if (member1Socket) member1Socket.join(chatId);
        }
        if (member2SocketId) {
            const member2Socket = io.sockets.sockets.get(member2SocketId);
            if (member2Socket)  member2Socket.join(chatId);
        }
;

        await isExistingRequest.deleteOne()
        emitEventToRoom(req,Events.NEW_CHAT,chatId,transformedChat[0]);

        return res.status(200).json(isExistingRequest._id)
    }

    else if(action==='reject'){
        await isExistingRequest.deleteOne()

        if(!isExistingRequest.sender.isActive && isExistingRequest.sender?.fcmToken && isExistingRequest.sender.notificationsEnabled){
          sendPushNotification({fcmToken:isExistingRequest.sender.fcmToken,body:`${req.user.username} has rejected your friend request ☹️`})
        }

        return res.status(200).json(isExistingRequest._id)
    }
    
})

export {getUserRequests,createRequest,handleRequest}