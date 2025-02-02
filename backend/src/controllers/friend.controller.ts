import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { prisma } from "../lib/prisma.lib.js";
import { asyncErrorHandler } from "../utils/error.utils.js";

export const getFriends = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const friends =  await prisma.friends.findMany({
        where:{
            OR:[
                {
                    user1Id:req.user.id
                },
                {
                    user2Id:req.user.id
                }
            ]
        },
        include:{
            user1:{
                select:{
                    id:true,
                    username:true,
                    avatar:true,
                    isOnline:true,
                    publicKey:true,
                    lastSeen:true,
                    verificationBadge:true,
                }
            },
            user2:{
                select:{
                    id:true,
                    username:true,
                    avatar:true,
                    isOnline:true,
                    publicKey:true,
                    lastSeen:true,
                    verificationBadge:true,
                }
            },
        },
        omit:{
            user1Id:true,
            user2Id:true,
            id:true,
        }
    })
    const userFriends = friends.map(friend=>friend.user1.id===req.user.id?{...friend.user2,...{createdAt:friend.createdAt}}:{...friend.user1,...{createdAt:friend.createdAt}})
    return res.status(200).json(userFriends);
})
