import { UploadApiResponse } from "cloudinary";
import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";
import { Events } from "../enums/event/event.enum.js";
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { IMemberDetails } from "../interfaces/chat/chat.interface.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import type { addMemberToChatType, createChatSchemaType, removeMemberfromChatType, updateChatSchemaType } from "../schemas/chat.schema.js";
import { deleteFilesFromCloudinary, uploadFilesToCloudinary } from "../utils/auth.util.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { emitEvent, emitEventToRoom, getOtherMembers } from "../utils/socket.util.js";
import { userSocketIds } from "../index.js";
import { Server } from "socket.io";


export const addUnreadMessagesAndSpectatorStage = {
  $addFields: {
    unreadMessages: {
      count: 0,
      message: {
        _id: "",
        content: "",
      },
      sender: {
        _id: "",
        username: "",
        avatar: "",
      },
    },
    userTyping: [],
    seenBy: [],
    spectators:[]
  },
}

export const populateMembersStage = {
  $lookup: {
    from: "users",
    localField: "members",
    foreignField: "_id",
    as: "members",
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
          publicKey:1,
          lastSeen:1,
          isActive:1,
          verificationBadge:1
        },
      },
    ],
  },
}

export const updateAvatarFeild = {
  $addFields: {
    avatar: "$avatar.secureUrl",
  },
}

const createChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    let uploadResults:UploadApiResponse[] = []

    const {isGroupChat,members,avatar,name}:createChatSchemaType = req.body

    if(isGroupChat==='true'){

        if(members.length<2){
            return next(new CustomError("Atleast 2 members are required to create group chat",400))
        }
        else if(!name){
            return next(new CustomError("name is required for creating group chat",400))
        }
        
        const membersWithReqUser=[...members,req.user?._id]

        const isExistingGroupChat = await Chat.findOne({
            members: { $all: membersWithReqUser, $size: membersWithReqUser.length },
          });
        
        if(isExistingGroupChat){
            return next(new CustomError("group chat already exists",400))
        }

        if(req.file){
            uploadResults = await uploadFilesToCloudinary([req.file])
        }

        const newGroupChat = await Chat.create({
            avatar:{
                secureUrl:uploadResults[0]?.secure_url?uploadResults[0].secure_url:DEFAULT_AVATAR,
                publicId:uploadResults[0]?.public_id?uploadResults[0].public_id:null
            },
            isGroupChat,
            members:membersWithReqUser,
            admin:req.user?._id,
            name
        })

        const transformedChat = await Chat.aggregate(
        [
          {
            $match: {
              _id: newGroupChat._id,
            },
          },
          updateAvatarFeild,
          populateMembersStage,
          addUnreadMessagesAndSpectatorStage
        ])
        
        const membersIdsInString:Array<string> = newGroupChat.members.map(member=>member._id.toString())

        const io:Server = req.app.get("io");
        const room = newGroupChat._id.toString();

        for(const memberId of membersIdsInString){
          const memberSocketId = userSocketIds.get(memberId);
          if(memberSocketId){
            const memberSocket =  io.sockets.sockets.get(memberSocketId);
            if(memberSocket){
              memberSocket.join(room);
            }
          }
        }
        emitEventToRoom(req,Events.NEW_CHAT,room,transformedChat[0]);
        return res.status(201);
    }

    else if(isGroupChat==='false'){

        if(members.length>1){
            return next(new CustomError("normal chat cannot have more than 1 member",400))
        }

        if(name){
            return next(new CustomError("Name cannot be assigned to a normal chat",400))
        }
        else if(avatar){
            return next(new CustomError("Avatar cannot be assigned to a normal chat",400))
        }
        
        const membersWithReqUser=[...members,req.user?._id]

        const isExistingChat = await Chat.findOne({
            members: { $all: membersWithReqUser, $size: membersWithReqUser.length },
          });

        if(isExistingChat){
            return next(new CustomError("Chat already exists",400))
        }

        const normalChat = await Chat.create({members:[...members,req.user?._id]})


        const transformedChat = await Chat.aggregate([
          {
            $match:{
              _id:normalChat._id
            }
          },
          populateMembersStage,
          addUnreadMessagesAndSpectatorStage
        ])

        const memberStringIds = normalChat.members.map(member=>member._id.toString())
        const otherMembers = getOtherMembers({members:memberStringIds,user:req.user?._id.toString()!})

        emitEvent(req,Events.NEW_CHAT,otherMembers,transformedChat)
        
        return res.status(201).json(transformedChat)
    }

})

const getUserChats = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const chats = await Chat.aggregate([

        {
          $match: {
            members: req.user?._id,
          },
        },

        updateAvatarFeild,
        populateMembersStage,
        {
          $lookup: {
            from: "unreadmessages",
            let: {
              chatId: "$_id",
              userId: req.user?._id,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$chat", "$$chatId"] },
                      { $eq: ["$user", "$$userId"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "sender",
                  foreignField: "_id",
                  as: "sender",
                  pipeline: [
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
                $lookup: {
                  from: "messages",
                  localField: "message",
                  foreignField: "_id",
                  as: "message",
                  pipeline: [
                    {
                      $project: {
                        content: 1,
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  count: 1,
                  message: 1,
                  sender: 1,
                },
              },
            ],
            as: "unreadMessages",
          },
        },
      
        {
          $addFields: {
            unreadMessages: {
              $arrayElemAt: ["$unreadMessages", 0],
            },
          },
        },
        {
          $addFields: {
            "unreadMessages.sender":{$arrayElemAt:['$unreadMessages.sender',0]},
            "unreadMessages.message":{$arrayElemAt:['$unreadMessages.message',0]},
            seenBy: [],
            userTyping: [],
            spectators:[],
          },
        },
        {
          $addFields: {
            "unreadMessages.sender.avatar": "$unreadMessages.sender.avatar.secureUrl"
          }
        },
      {
        $addFields: {
          "unreadMessages": {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$unreadMessages", {}] },
                  { $eq: ["$unreadMessages", null] },
                  { $not: ["$unreadMessages"] }
                ]
              },
              then: {
                count: 0,
                message: {
                  content: "",
                  url: false,
                  attachments: false,
                  poll: false
                },
                sender: {
                  _id: "",
                  username: "",
                  avatar: ""
                }
              },
              else: {
                $cond: {
                  if: {
                    $or: [
                      { $eq: ["$unreadMessages.message", null] },
                      { $not: ["$unreadMessages.message"] }
                    ]
                  },
                  then: {
                    count: 0,
                    message: {
                      content: "",
                      url: false,
                      attachments: false,
                      poll: false
                    },
                    sender: {
                      _id: "",
                      username: "",
                      avatar: ""
                    }
                  },
                  else: "$unreadMessages"
                }
              }
            }
          }
        }
      },
        {
          $lookup: {
            from: "messages",
            localField: "latestMessage",
            foreignField: "_id",
            as: "latestMessage"
          }
        },
        {
          $addFields: {
            latestMessage:{$arrayElemAt:['$latestMessage',0]}
          }
        },
        {
          $addFields: {
            "latestMessage.content": {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$latestMessage", {}] },
                    { $eq: ["$latestMessage", null] },
                    { $not: ["$latestMessage"] }
                  ]
                },
                then: "hello world",
                else: "$latestMessage.content"
              }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "latestMessage.sender",
            foreignField: "_id",
            as: "latestMessage.sender",
            pipeline: [
              {
                $project: {
                  username: 1,
                  avatar: "$avatar.secureUrl"
                }
              }
            ]
          }
        },
        {
          $addFields: {
            "latestMessage.sender": {
              $arrayElemAt: ["$latestMessage.sender", 0]
            }
          }
        }
    ])

    return res.status(200).json(chats)

})

const addMemberToChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id}=req.params
    const {members}:addMemberToChatType = req.body

    const isExistingChat = await Chat.findById(id)

    if(!isExistingChat){
        return next(new CustomError("Chat does not exists",404))
    }

    if(!isExistingChat.isGroupChat){
        return next(new CustomError("This is not a group chat, you cannot add members",400))
    }
    const isAdminAddingMember = isExistingChat.admin?._id.toString() === req.user?._id.toString()
    if(!isAdminAddingMember){
        return next(new CustomError("You are not allowed to add members as you are not the admin of this chat",400))
    }

    const newMembersToBeAddedDetails =  await User.aggregate([
      {
        $match:{
          _id:{$in:members.map(member=>new Types.ObjectId(member))}
        }
      },
      updateAvatarFeild,
      {
        $project:{
          username:1,
          avatar:1
        }
      }
    ]) as Array<IMemberDetails>


    const ifNewMembersToBeAddedExistsAlreadyInChat = newMembersToBeAddedDetails.filter(newMember=>isExistingChat.members.includes(new Types.ObjectId(newMember._id)));

    if(ifNewMembersToBeAddedExistsAlreadyInChat.length){
        return next(new CustomError(`${ifNewMembersToBeAddedExistsAlreadyInChat.map(member=>`${member.username}`)} already exists in members of this chat`,400))
    }
    
    const oldMemberIds = isExistingChat.members.map(member=>member._id.toString());
    isExistingChat.members.push(...newMembersToBeAddedDetails.map(member=>new Types.ObjectId(member._id)));
    await isExistingChat.save();

    const transformedChat = await Chat.aggregate([
      {
        $match:{
          _id:isExistingChat._id
        }
      },
      updateAvatarFeild,
      populateMembersStage,
      addUnreadMessagesAndSpectatorStage
    ])
    // now we have to do two task
    // 1nd emit the "new member added" event to the old members
    // 2st emit the "new chat" event to the new Members and join their sockets to the new chat room

    const io:Server = req.app.get("io");

    // joining the new members in the room
    const newMemberIds =  newMembersToBeAddedDetails.map(newMember=>newMember._id.toString());
    const room = isExistingChat._id.toString();
    for(const memberId of newMemberIds){
      const memberSocketId = userSocketIds.get(memberId);
      if(memberSocketId){
        const memberSocket = io.sockets.sockets.get(memberSocketId);
        if(memberSocket){
          memberSocket.join(room);
        }
      }
    }
    // emitting the new chat event to the new members
    emitEvent(req,Events.NEW_CHAT,newMemberIds,transformedChat[0]);

    // now we will deal wiht old members
    const payload = {
      chatId:isExistingChat._id,
      members:newMembersToBeAddedDetails
    }
    emitEvent(req,Events.NEW_MEMBER_ADDED,oldMemberIds,payload);
    return res.status(200);
})

const removeMemberFromChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id}=req.params
    const {members}:removeMemberfromChatType = req.body

    const isExistingChat = await Chat.findById(id)

    if(!isExistingChat){
        return next(new CustomError("Chat does not exists",404))
    }

    if(!isExistingChat.isGroupChat){
        return next(new CustomError("This is not a group chat, you cannot remove members",400))
    }

    const isAdminRemovingMembers = req.user?._id.toString() === isExistingChat.admin?._id.toString();
    if(!isAdminRemovingMembers){
        return next(new CustomError("You are not allowed to remove members as you are not the admin of this chat",400))
    }
    
    if(isExistingChat.members.length===3){
      return next(new CustomError("Minimum 3 members are required in a group chat",400))
    }

    const existingMemberIds = isExistingChat.members.map(member=>member._id.toString());
    const invalidMemberIds = members.filter(member=>!existingMemberIds.includes(member));

    if(invalidMemberIds.length){
      return next(new CustomError("Please provide valid members to remove",400))
    }

    const isAdminLeavingIndex = members.findIndex(member=>isExistingChat.admin?._id.toString()===member)
    
    if(isAdminLeavingIndex!==-1){
        isExistingChat.admin = isExistingChat.members[0];
    }

    isExistingChat.members = isExistingChat.members.filter(existingMember=>!members.includes(existingMember._id.toString()));
    await isExistingChat.save();

    emitEvent(req,Events.DELETE_CHAT,members,{chatId:isExistingChat._id});

    const remainingMembers = isExistingChat.members.map(member=>member._id.toString());
    emitEvent(req,Events.MEMBER_REMOVED,remainingMembers,{chatId:isExistingChat._id,membersId:members})

    return res.status(200);
})

const updateChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const { id } = req.params
    const { name }:updateChatSchemaType = req.body;
    const avatar = req.file

    if(!name && !avatar){
      return next(new CustomError("Either avatar or name is required for updating a chat, please provide one"))
    }

    const chat = await Chat.findOne({_id:id})

    if (!chat) {
        return next(new CustomError("chat not found",404))
    }

    if(!chat?.isGroupChat){
      return next(new CustomError("You cannot update a private chat",400))
    }

    if (name) chat.name = name;

    if(avatar){
            
      if(chat.avatar?.publicId){
        await deleteFilesFromCloudinary([chat.avatar.publicId])
      }
      
      const uploadResult = await uploadFilesToCloudinary([avatar])

      if(chat.avatar){
        chat.avatar.publicId = uploadResult[0].public_id
        chat.avatar.secureUrl = uploadResult[0].secure_url
      }

    }

    await chat.save();

    const updatedChatInfo:{name?:string,secureUrl?:string} = {}

    if(name){
      updatedChatInfo.name = chat.name 
    }
    if(avatar){
      updatedChatInfo.secureUrl = chat.avatar?.secureUrl
    }
    
    const payload:{_id:string,name?:string,avatar?:string} = {
      _id:chat._id.toString()
    }

    if(name) payload.name = chat.name
    if(avatar) payload.avatar = chat.avatar?.secureUrl

    emitEventToRoom(req,Events.GROUP_UPDATE,chat._id.toString(),payload)

    return res.status(200).json({})
})

export { addMemberToChat, createChat, getUserChats, removeMemberFromChat, updateChat };

