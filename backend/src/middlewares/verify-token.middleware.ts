import { NextFunction, Response } from "express"
import jwt from 'jsonwebtoken'
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js"
import { prisma } from "../lib/prisma.lib.js"
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js"


type SessionPayload = {
    userId: string;
    expiresAt: Date;
  };

  
export const verifyToken=asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

        const {token} = req.cookies

        const secretKey = "helloWorld@123";
        const encodedKey = new TextEncoder().encode(secretKey);

        if(!token){
            return next(new CustomError("Token missing, please login again",401))
        }

        const decodedInfo=jwt.verify(token,secretKey,{algorithms:['HS256']}) as SessionPayload

        if(!decodedInfo || !decodedInfo.userId){
            return next(new CustomError("Invalid token please login again",401))
        }

        const user = await prisma.user.findUnique({
            where:{
                id:decodedInfo.userId
            },
            select:{
                id:true,
                name:true,
                username:true,
                avatar:true,
                email:true,
                createdAt:true,
                updatedAt:true,
                emailVerified:true,
                publicKey:true,
                notificationsEnabled:true,
                verificationBadge:true,
                fcmToken:true,
                oAuthSignup:true,
            }
        })

        if(!user){
            return next(new CustomError('Invalid Token, please login again',401))
        }
        req.user=user
        next()
})