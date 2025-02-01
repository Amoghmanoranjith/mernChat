import { v2 as cloudinary } from 'cloudinary'
import { CookieOptions, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { ISecureInfo, IUser } from '../interfaces/auth/auth.interface.js'
import { env } from '../schemas/env.schema.js'

export const cookieOptions:CookieOptions = {
    // maxAge:parseInt(env.JWT_TOKEN_EXPIRATION_DAYS) * 24 * 60 * 60,
    maxAge:30 /*30 days*/ * 24 * 60 * 60 * 1000,
    httpOnly:true,
    path:"/",
    priority:"high",
    secure:true,
    sameSite:env.NODE_ENV==='DEVELOPMENT'?"lax":"none",
    domain: env.NODE_ENV === 'DEVELOPMENT' ? 'localhost' : 'aesehi.online',
    partitioned:true,
}

export const sendToken = (res:Response,payload:IUser['_id'],statusCode:number,data:ISecureInfo,oAuth:boolean=false,oAuthNewUser:boolean=false,googleId?:string)=>{

    if(oAuth){
        
        let responsePayload:{combinedSecret?:string,user:ISecureInfo} = {user:data}

        const token=jwt.sign({_id:payload.toString()},env.JWT_SECRET,{expiresIn:`${env.JWT_TOKEN_EXPIRATION_DAYS}d`})
        res.cookie('token',token,cookieOptions)

        if(oAuthNewUser){
            const combinedSecret = googleId+env.PRIVATE_KEY_RECOVERY_SECRET
            // as the user has signed up using OAuth, so they have no password
            // so we will combine their googleId with a secret to from a "combinedSecret"
            // and this "combinedSecret" will be used to encrypt their private key instead of using their password as they have no password
            // and in this way we can also store their private key in an encryptedFormat in the database
            responsePayload['combinedSecret'] = combinedSecret
        }
        return res.status(statusCode).json(responsePayload)
    }
        
    else{
        const token=jwt.sign({_id:payload.toString()},env.JWT_SECRET,{expiresIn:`${env.JWT_TOKEN_EXPIRATION_DAYS}d`})
        return res.cookie("token",token,cookieOptions).status(statusCode).json(data)
    }
 
}

export const generateOtp=():string=>{

    let OTP=""

    for(let i= 0 ; i<4 ; i++){
        OTP+=Math.floor(Math.random()*10)
    }

    return OTP

}

export const uploadFilesToCloudinary = async(files:Array<Express.Multer.File>)=>{
    const uploadPromises = files.map(file=>cloudinary.uploader.upload(file.path))
    const result = await Promise.all(uploadPromises)
    return result
}

export const deleteFilesFromCloudinary = async(publicIds:Array<string>)=>{
    const deletePromises = publicIds.map(publicId=>cloudinary.uploader.destroy(publicId))
    const uploadResult = await Promise.all(deletePromises)
    return uploadResult
}

export const getSecureUserInfo = (user:any):any=>{
    return {
        id:user._id,
        name:user.name,
        username:user.username,
        avatar:user.avatar?.secureUrl,
        email:user.email,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt,
        verified:user.verified,
        publicKey:user?.publicKey,
        notificationsEnabled:user.notificationsEnabled,
        verificationBadge:user.verificationBadge,
        fcmTokenExists:user.fcmToken?.length?true:false,
        oAuthSignup:user.oAuthSignup
    }
}