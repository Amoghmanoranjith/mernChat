import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { CookieOptions, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../schemas/env.schema.js'


const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;

export const cookieOptions:CookieOptions = {
    maxAge:thirtyDaysInMilliseconds,
    httpOnly:true,
    path:"/",
    priority:"high",
    secure:true,
    sameSite:env.NODE_ENV==='DEVELOPMENT'?"lax":"none",
    domain: env.NODE_ENV === 'DEVELOPMENT' ? 'localhost' : 'aesehi.online',
    partitioned:true,
}

export const generateOtp=():string=>{
    let OTP=""
    for(let i= 0 ; i<4 ; i++) OTP+=Math.floor(Math.random()*10)
    return OTP
}

export const uploadFilesToCloudinary = async({files}:{files:Express.Multer.File[]})=>{
    try {
        const uploadPromises = files.map(file=>cloudinary.uploader.upload(file.path))
        const result = await Promise.all(uploadPromises)
        return result
    } catch (error) {
        console.log('Error uploading files to cloudinary');
        console.log(error);
    }
}

export const deleteFilesFromCloudinary = async({publicIds}:{publicIds:string[]}):Promise<any[] | undefined>=>{
    try {
        await cloudinary.uploader.destroy(publicIds[0])
        const deletePromises = publicIds.map(publicId=>cloudinary.uploader.destroy(publicId))
        const uploadResult = await Promise.all(deletePromises)
        return uploadResult
    } catch (error) {
        console.log('Error deleting files from cloudinary');
        console.log(error);
    }
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