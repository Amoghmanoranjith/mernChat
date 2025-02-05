import { UploadApiResponse } from "cloudinary";
import { NextFunction, Response } from "express";
import { Server } from "socket.io";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";
import { Events } from "../enums/event/event.enum.js";
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { prisma } from "../lib/prisma.lib.js";
import type { addMemberToChatType, createChatSchemaType, removeMemberfromChatType, updateChatSchemaType } from "../schemas/chat.schema.js";
import { deleteFilesFromCloudinary, uploadFilesToCloudinary } from "../utils/auth.util.js";
import { disconnectMembersFromChatRoom, joinMembersInChatRoom } from "../utils/chat.util.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { emitEvent, emitEventToRoom } from "../utils/socket.util.js";

const createChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    let uploadResults:UploadApiResponse[] | void = []

    const {isGroupChat,members,avatar,name}:createChatSchemaType = req.body

    if(isGroupChat==='true'){

        if(members.length<2){
            return next(new CustomError("Atleast 2 members are required to create group chat",400))
        }
        else if(!name){
            return next(new CustomError("name is required for creating group chat",400))
        }

        const memberIds=[...members,req.user.id]

        const existingChat = await prisma.chat.findFirst({
          where: {
            AND: [
              { members: { every: { id: { in: memberIds } } } }, // Ensure all members exist
              { members: { none: { id: { notIn: memberIds } } } } // Ensure no extra members exist
            ]
          },
        });
        
        if(existingChat){
            return next(new CustomError("group chat already exists",400))
        }
        let hasAvatar = false;
        if(req.file){
            hasAvatar = true;
            uploadResults = await uploadFilesToCloudinary({files:[req.file]})
        }

        const avatar = (hasAvatar && uploadResults && uploadResults[0]) ? uploadResults[0].secure_url : DEFAULT_AVATAR;
        const avatarCloudinaryPublicId = (hasAvatar && uploadResults && uploadResults[0]) ? uploadResults[0].public_id : null;
        
        const newChat = await prisma.chat.create({
          data:{
            avatar,                    
            avatarCloudinaryPublicId,
            isGroupChat:true,
            members:{
              connect:members.map(member=>({id:member}))
            },
            adminId:req.user.id,
            name,
          },
          omit:{
            avatarCloudinaryPublicId:true,
          },
          include:{
            UnreadMessages:{
              select:{
                count:true,
                message:{
                  select:{
                    isTextMessage:true,
                    url:true,
                    attachments:{
                      select:{
                        secureUrl:true,
                      }
                    },
                    isPollMessage:true,
                    createdAt:true,
                  }
                },
                sender:{
                  select:{
                    id:true,
                    username:true,
                    avatar:true,
                    isOnline:true,
                    publicKey:true,
                    lastSeen:true,
                    verificationBadge:true
                  }
                },
              }
            },
            members:{
              select:{
                id:true,
                username:true,
                avatar:true,
                isOnline:true,
                publicKey:true,
                lastSeen:true,
                verificationBadge:true
              }
            },
            latestMessage:{
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
                    secureUrl:true
                  }
                },
                poll:true,
                reactions:{
                  include:{
                    user:{
                      select:{
                        id:true,
                        username:true,
                        avatar:true
                      }
                    }
                  },
                  select:{
                    reaction:true,
                  }
                },
              }
            }
          }
        })
        
        const io:Server = req.app.get("io");
        joinMembersInChatRoom({memberIds,roomToJoin:newChat.id,io})
        emitEventToRoom({event:Events.NEW_CHAT,io,room:newChat.id,data:newChat});
        return res.status(201);
    }
})

const getUserChats = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const chats = await prisma.chat.findMany({
      where:{
        members:{
          some:{
            id:req.user.id
          }
        }
      },
      omit:{
        avatarCloudinaryPublicId:true,
      },
      include:{
        UnreadMessages:{
          select:{
            count:true,
            message:{
              select:{
                isTextMessage:true,
                url:true,
                attachments:{
                  select:{
                    secureUrl:true,
                  }
                },
                isPollMessage:true,
                createdAt:true,
              }
            },
            sender:{
              select:{
                id:true,
                username:true,
                avatar:true,
                isOnline:true,
                publicKey:true,
                lastSeen:true,
                verificationBadge:true
              }
            },
          }
        },
        members:{
          select:{
            id:true,
            username:true,
            avatar:true,
            isOnline:true,
            publicKey:true,
            lastSeen:true,
            verificationBadge:true
          }
        },
        latestMessage:{
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
                secureUrl:true
              }
            },
            poll:true,
            reactions:{
              include:{
                user:{
                  select:{
                    id:true,
                    username:true,
                    avatar:true
                  }
                },
              },
              omit:{
                id: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                messageId: true
              }
            },
          }
        }
      }
    })

    return res.status(200).json(chats)

})

const addMemberToChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id}=req.params
    const {members}:addMemberToChatType = req.body

    const chat = await prisma.chat.findUnique({
      where:{
        id,
      },
      include:{
        members:{
          select:{
            id:true
          }
        }
      }
    })

    if(!chat){
        return next(new CustomError("Chat does not exists",404))
    }

    if(!chat.isGroupChat){
        return next(new CustomError("This is not a group chat, you cannot add members",400))
    }
    const isAdminAddingMember = chat.adminId === req.user.id;
    if(!isAdminAddingMember){
        return next(new CustomError("You are not allowed to add members as you are not the admin of this chat",400))
    }
    
    const existingMemberIds = chat.members.map(member=>member.id)

    const invalidMembers = members.filter(member=>existingMemberIds.includes(member))

    if(invalidMembers.length){
      return next(new CustomError(`${invalidMembers.map(member=>`${member}`)} already exists in members of this chat`,400))
    }

    const newMemberDetails = await prisma.user.findMany({
      where:{
        id:{
          in:members
        }
      },
      select:{
        id:true,
        username:true,
        avatar:true,
        isOnline:true,
        publicKey:true,
        lastSeen:true,
        verificationBadge:true
      }
    })

    await prisma.chat.update({
      where:{
        id:chat.id,
      },
      data:{
        members:{
          connect:newMemberDetails.map(member=>({id:member.id}))
        }
      }
    })

    const updatedChat = await prisma.chat.findMany({
      where:{
        id:chat.id
      },
      omit:{
        avatarCloudinaryPublicId:true,
      },
      include:{
        UnreadMessages:{
          select:{
            count:true,
            message:{
              select:{
                isTextMessage:true,
                url:true,
                attachments:{
                  select:{
                    secureUrl:true,
                  }
                },
                isPollMessage:true,
                createdAt:true,
              }
            },
            sender:{
              select:{
                id:true,
                username:true,
                avatar:true,
                isOnline:true,
                publicKey:true,
                lastSeen:true,
                verificationBadge:true
              }
            },
          }
        },
        members:{
          select:{
            id:true,
            username:true,
            avatar:true,
            isOnline:true,
            publicKey:true,
            lastSeen:true,
            verificationBadge:true
          }
        },
        latestMessage:{
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
                secureUrl:true
              }
            },
            poll:true,
            reactions:{
              include:{
                user:{
                  select:{
                    id:true,
                    username:true,
                    avatar:true
                  }
                }
              },
              select:{
                reaction:true,
              }
            },
          }
        }
      }
    })
    
    const io:Server = req.app.get("io");

    // join the new members in the chat room
    joinMembersInChatRoom({io,roomToJoin:chat.id,memberIds:members})

    // emitting the new chat event to the new members
    emitEvent({event:Events.NEW_CHAT,data:updatedChat,io,users:members})

    // emitting the new member added event to the existing members
    // with new member details
    const payload = {
      chatId:chat.id,
      members:newMemberDetails
    }
    emitEvent({data:payload,event:Events.NEW_MEMBER_ADDED,io,users:existingMemberIds});
    return res.status(200);
})

const removeMemberFromChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {id}=req.params
    const {members}:removeMemberfromChatType = req.body

    const chat = await prisma.chat.findUnique({
      where:{
        id,
      },
      include:{
        members:{
          select:{
            id:true
          }
        }
      }
    })

    if(!chat){
        return next(new CustomError("Chat does not exists",404))
    }

    if(!chat.isGroupChat){
        return next(new CustomError("This is not a group chat, you cannot remove members",400))
    }

    const isAdminRemovingMembers = req.user.id === chat.adminId;
    if(!isAdminRemovingMembers){
        return next(new CustomError("You are not allowed to remove members as you are not the admin of this chat",400))
    }
    
    if(chat.members.length===3){
      return next(new CustomError("Minimum 3 members are required in a group chat",400))
    }

    const existingMemberIds = chat.members.map(member=>member.id);
    const invalidMemberIds = members.filter(member=>!existingMemberIds.includes(member));

    if(invalidMemberIds.length){
      return next(new CustomError("Please provide valid members to remove",400))
    }

    const isAdminLeaving = members.findIndex(member=>member === chat.adminId);
    
    if(isAdminLeaving!==-1){
        // if admin is leaving the chat
        // then assign the admin role to the first member
        chat.adminId = existingMemberIds[0]
    }

    await prisma.chat.update({
      where: {
        id: id,
      },
      data: {
        members: {
          disconnect: members.map(memberId => ({ id: memberId })) // Corrected
        }
      }
    });

    const io:Server = req.app.get("io");

    disconnectMembersFromChatRoom({io,memberIds:members,roomToLeave:id})

    emitEvent({io,event:Events.DELETE_CHAT,users:members,data:{chatId:id}})

    const remainingMembers = existingMemberIds.filter(member=>!members.includes(member))
    emitEvent({io,event:Events.MEMBER_REMOVED,data:{chatId:id,membersId:members},users:remainingMembers})

    return res.status(200);
})

const updateChat = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const { id } = req.params
    const { name }:updateChatSchemaType = req.body;
    const avatar = req.file

    if(!name && !avatar){
      return next(new CustomError("Either avatar or name is required for updating a chat, please provide one"))
    }

    const chat = await prisma.chat.findUnique({
      where:{
        id
      }
    })

    if (!chat) {
        return next(new CustomError("chat not found",404))
    }

    if(!chat.isGroupChat){
      return next(new CustomError("You cannot update a private chat",400))
    }

    if(avatar){
            
      if(chat.avatarCloudinaryPublicId){
        // removing old group chat avatar from cloudinary (to free up cloud space)
        await deleteFilesFromCloudinary({publicIds:[chat.avatarCloudinaryPublicId]})
      }
      // now uploading the new group chat avatar to cloudinary
      const uploadResult = await uploadFilesToCloudinary({files:[avatar]})

      if(!uploadResult){
        return next(new CustomError("Error updating chat avatar",404))    
      }

      await prisma.chat.update({
        where:{
          id
        },
        data:{
          avatarCloudinaryPublicId:uploadResult[0].public_id,
          avatar:uploadResult[0].secure_url
        }
      })
    }

    if(name){
      await prisma.chat.update({
        where:{
          id
        },
        data:{
          name
        }
      })
    }

    const io:Server = req.app.get("io");
    const payload = {id,avatar,name}
    emitEventToRoom({io,event:Events.GROUP_UPDATE,room:id,data:payload})
    return res.status(200)
})

export { addMemberToChat, createChat, getUserChats, removeMemberFromChat, updateChat };

