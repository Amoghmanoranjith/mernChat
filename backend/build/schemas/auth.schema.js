import { z } from "zod";
const passwordValidation = z.string({ required_error: "Password is required" }).min(8, 'Password cannot be shorter than 8 characters').max(40, 'Password cannot be longer than 30 characters')
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, 'Password must contain 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number');
export const forgotPasswordSchema = z.object({
    email: z.string({ required_error: "Email is required for sending password reset link" })
});
export const resetPasswordSchema = z.object({
    token: z.string({ required_error: "password reset token is required" }),
    newPassword: passwordValidation
});
export const verifyOtpSchema = z.object({
    otp: z.string({ required_error: "otp is required" })
});
export const keySchema = z.object({
    publicKey: z.string({ required_error: "Public key is required" }),
    privateKey: z.string({ required_error: "Private key is required" })
});
export const verifyPasswordSchema = z.object({
    password: z.string({ required_error: "Password is required" })
});
export const verifyPrivateKeyTokenSchema = z.object({
    recoveryToken: z.string({ required_error: "Recovery token is required" })
});
export const fcmTokenSchema = z.object({
    fcmToken: z.string({ required_error: "fcm token is required" })
});
export const setAuthCookieSchema = z.object({
    token: z.string({ required_error: "token is required" })
});
