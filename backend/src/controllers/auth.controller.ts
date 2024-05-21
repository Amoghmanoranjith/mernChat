import { NextFunction, Request, Response } from "express";
import { type signupSchemaType } from "../schemas/auth.schema.js";
import { User } from "../models/user.model.js";
import { CustomError, asyncErrorHandler } from "../utils/error.utils.js";
import { generateOtp, getSecureUserInfo, sendToken } from "../utils/auth.util.js";
import type { loginSchemaType, verifyOtpSchemaType } from "../schemas/auth.schema.js";
import bcrypt from 'bcryptjs'
import type { forgotPasswordSchemaType } from "../schemas/auth.schema.js";
import { sendMail } from "../utils/email.util.js";
import { ResetPassword } from "../models/reset-password.model.js";
import { env } from "../schemas/env.schema.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/env.config.js";
import type { resetPasswordSchemaType } from "../schemas/auth.schema.js";
import type { IUser } from "../interfaces/auth/auth.interface.js";
import type { AuthenticatedRequest } from "../interfaces/auth/auth.interface.js";
import { Otp } from "../models/otp.model.js";
import { DEFAULT_AVATAR } from "../constants/file.constant.js";

const signup = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {username,password,email,name}:signupSchemaType=req.body
    

    const isExistingUser = await User.findOne({email})

    if(isExistingUser){
        return next(new CustomError("User already exists",400))
    }

    const existingUsername = await User.findOne({username})

    if(existingUsername){
        return next(new CustomError("Username is already taken",400))
    }

    const hashedPassword = await bcrypt.hash(password,10)


    const newUser = await User.create({email,name,password:hashedPassword,username,avatar:{
        secureUrl:DEFAULT_AVATAR
    }})
    sendToken(res,newUser._id,201,getSecureUserInfo(newUser) as IUser)
    
}) 

const login = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}:loginSchemaType=req.body

    const isExistingUser = await User.findOne({email}).select("+password")

    if(isExistingUser && await bcrypt.compare(password,isExistingUser.password)){
        
        sendToken(res,isExistingUser['_id'],200,getSecureUserInfo(isExistingUser) as IUser)
        return 
    }

    return next(new CustomError("Invalid Credentials",404))
    
})

const forgotPassword = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {email}:forgotPasswordSchemaType = req.body

    const isValidUser = await User.findOne({email})

    if(!isValidUser){
        return next(new CustomError("User with this email does not exists",404))
    }

    await ResetPassword.deleteMany({user:isValidUser._id})

    const token = jwt.sign({_id:isValidUser._id.toString()},env.JWT_SECRET)
    const hashedToken = await bcrypt.hash(token,10)

    await ResetPassword.create({user:isValidUser._id,hashedToken})
    const resetUrl = `${config.clientUrl}/auth/reset-password?token=${token}&user=${isValidUser._id.toString()}`

    await sendMail(email,isValidUser.username,"resetPassword",resetUrl,undefined)

    res.status(200).json({message:`We have sent a password reset link on ${email}`})
})

const resetPassword = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {token,newPassword,userId}:resetPasswordSchemaType = req.body


    const doesPasswordResetExists = await ResetPassword.findOne({user:userId})

    if(!doesPasswordResetExists){
        return next(new CustomError("Password reset link is invalid",404))
    }

    const isValidUser = await User.findById(userId)

    if(!isValidUser){
        return next(new CustomError("User not found",404))
    }

    if(doesPasswordResetExists.expiresAt! < new Date){
        await doesPasswordResetExists.deleteOne()
        return next(new CustomError("Password reset link has been expired",400))
    }

    const decodedInfo = jwt.verify(token,env.JWT_SECRET) as IUser['_id']

    if(!decodedInfo || !decodedInfo._id || decodedInfo._id.toString()!==userId) {
        console.log(decodedInfo._id);
        return next(new CustomError("Password reset link is invalid",400))
    }

    isValidUser.password = await bcrypt.hash(newPassword,10)
    await isValidUser.save()

    await ResetPassword.deleteMany({user:decodedInfo._id})

    return res.status(200).json({message:`Dear ${isValidUser.username}, your password has been reset successfuly`})

})

const sendOtp = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    await Otp.deleteMany({user:req.user?._id})

    const otp = generateOtp()
    const hashedOtp = await bcrypt.hash(otp,10)

    const newOtp = await Otp.create({user:req.user?._id,hashedOtp})

    await sendMail(req.user?.email!,req.user?.username!,"OTP",undefined,otp)

    return res.status(201).json({message:`We have sent the otp on ${req.user?.email}`})
})

const verifyOtp = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    const {otp}:verifyOtpSchemaType = req.body

    const isOtpExisting = await Otp.findOne({user:req.user?._id})

    if(!isOtpExisting){
        return next(new CustomError("Otp does not exists",404))
    }

    if(isOtpExisting.expiresAt! < new Date){
        await isOtpExisting.deleteOne()
        return next(new CustomError("Otp has been expired",400))
    }

    if(!(await bcrypt.compare(otp,isOtpExisting.hashedOtp))){
        return next(new CustomError("Otp is invalid",400))
    }

    await isOtpExisting.deleteOne()
    const verifiedUser = await User.findByIdAndUpdate(req.user?._id,{verified:true},{new:true}) as IUser
    return res.status(200).json(getSecureUserInfo(verifiedUser))

})

const checkAuth = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    if(req.user){
        return res.status(200).json(getSecureUserInfo(req.user))
    }

    return next(new CustomError("Token missing, please login again",401))
})

const redirectHandler = asyncErrorHandler(async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{

    if(req.user){
        sendToken(res,req.user?._id,200,getSecureUserInfo(req.user) as IUser,true)
    }
    else{
        return res.redirect("/")
    }
})

const logout = asyncErrorHandler(async(req:Request,res:Response,next:NextFunction)=>{
    res.clearCookie("token").status(200).json({message:"Logout successful"})
})


export {signup,login,logout,forgotPassword,resetPassword,sendOtp,verifyOtp,checkAuth,redirectHandler}