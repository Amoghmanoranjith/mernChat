import { NextFunction, Response } from "express"
import jwt from 'jsonwebtoken'
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js"
import { prisma } from "../lib/prisma.lib.js"
import { env } from "../schemas/env.schema.js"
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js"

export const verifyToken=asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

        const {token} = req.cookies

        if(!token){
            return next(new CustomError("Token missing, please login again",401))
        }

        const decodedInfo=jwt.verify(token,env.JWT_SECRET) as {id:string}

        if(!decodedInfo || !decodedInfo.id){
            return next(new CustomError("Invalid token please login again",401))
        }

        const user = await prisma.user.findUnique({
            where:{
                id:decodedInfo.id
            }
        })

        if(!user){
            return next(new CustomError('Invalid Token, please login again',401))
        }
        req.user=user
        next()
})