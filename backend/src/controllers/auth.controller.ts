import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/env.config.js";
import type { AuthenticatedRequest, OAuthAuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { prisma } from '../lib/prisma.lib.js';
import type { fcmTokenSchemaType, keySchemaType, resetPasswordSchemaType, verifyOtpSchemaType } from "../schemas/auth.schema.js";
import { env } from "../schemas/env.schema.js";
import { cookieOptions, generateOtp } from "../utils/auth.util.js";
import { sendMail } from "../utils/email.util.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";


const resetPassword = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {token,newPassword}:resetPasswordSchemaType = req.body;

    const {id:decodedUserId} = jwt.verify(token,env.JWT_SECRET) as {id:string};

    const doesResetPasswordRequestExistsForThisUser = await prisma.resetPasswordToken.findFirst({
        where:{
            userId:decodedUserId
        }
    })

    if(!doesResetPasswordRequestExistsForThisUser){
        return next(new CustomError("Password reset link is invalid",404))
    }

    if(doesResetPasswordRequestExistsForThisUser.expiresAt < new Date){
        return next(new CustomError("Password reset link has been expired",400))
    }

    const user = await prisma.user.update({
        where:{
            id:decodedUserId
        },
        data:{
            hashedPassword:await bcrypt.hash(newPassword,10)
        }
    })
    
    return res.status(200).json({message:`Dear ${user.username}, your password has been reset successfuly`})
})

const sendOtp = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    await prisma.otp.deleteMany({
        where:{
            userId:req.user.id
        }
    })
    const otp = generateOtp()
    const hashedOtp = await bcrypt.hash(otp,10)
    await prisma.otp.create({
        data:{
            userId:req.user.id,
            hashedOtp,
            expiresAt:new Date(Date.now()+env.OTP_EXPIRATION_MINUTES),
        }
    })
    await sendMail(req.user.email,req.user.username,'OTP',undefined,otp,undefined)
    return res.status(201).json({message:`We have sent the otp on ${req.user?.email}`})
})

const verifyOtp = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {otp}:verifyOtpSchemaType = req.body

    const otpExists = await prisma.otp.findFirst({
        where:{
            userId:req.user.id
        }
    })
    if(!otpExists){
        return next(new CustomError("Otp does not exists",404))
    }
    if(otpExists.expiresAt! < new Date){
        return next(new CustomError("Otp has been expired",400))
    }

    if(!(await bcrypt.compare(otp,otpExists.hashedOtp))){
        return next(new CustomError("Otp is invalid",400))
    }

    const user =  await prisma.user.update({
        where:{
            id:req.user.id
        },
        data:{
            emailVerified:true
        },
    })

    const secureUserInfo = {
        id:user.id,
        name:user.name,
        username:user.username,
        avatar:user.avatar,
        email:user.email,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
        emailVerified:user.emailVerified,
        publicKey:user.publicKey,
        notificationsEnabled:user.notificationsEnabled,
        verificationBadge:user.verificationBadge,
        fcmToken:user.fcmToken,
        oAuthSignup:user.oAuthSignup
    }

    return res.status(200).json(secureUserInfo);

})

const updateUserKeys = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const {publicKey,privateKey}:keySchemaType = req.body;
    const user = await prisma.user.update({
        where:{
            id:req.user?.id
        },
        data:{
            publicKey,
            privateKey
        }
    })
    return res.status(200).json({publicKey:user.publicKey})
})

const updateFcmToken = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {fcmToken}:fcmTokenSchemaType = req.body

    const user =  await prisma.user.update({
        where:{
            id:req.user.id
        },
        data:{
            fcmToken
        }
    })
    return res.status(200).json({fcmToken:user.fcmToken})
})

const checkAuth = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    if(req.user){
        const secureUserInfo = {
            id:req.user.id,
            name:req.user.name,
            username:req.user.username,
            avatar:req.user.avatar,
            email:req.user.email,
            createdAt:req.user.createdAt,
            updatedAt:req.user.updatedAt,
            emailVerified:req.user.emailVerified,
            publicKey:req.user.publicKey,
            notificationsEnabled:req.user.notificationsEnabled,
            verificationBadge:req.user.verificationBadge,
            fcmToken:req.user.fcmToken,
            oAuthSignup:req.user.oAuthSignup
        }
        return res.status(200).json(secureUserInfo)
    }
    return next(new CustomError("Token missing, please login again",401))
})

const redirectHandler = asyncErrorHandler(async(req:OAuthAuthenticatedRequest,res:Response,next:NextFunction)=>{

    if(req.user){
        const tempToken =  jwt.sign({user:req.user.id,oAuthNewUser:req.user.newUser},env.JWT_SECRET,{expiresIn:"5m"})
        return res.redirect(307,`${config.clientUrl}/auth/oauth-redirect?token=${tempToken}`)
    }
    else{
        return res.redirect(`${config.clientUrl}/auth/login`)
    }
})

const logout = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    res.clearCookie("token",{...cookieOptions,maxAge:0}).status(200).json({message:"Logout successful"})
})

export {
    checkAuth,
    logout,
    redirectHandler,
    resetPassword, sendOtp, updateFcmToken, updateUserKeys,
    verifyOtp
};

