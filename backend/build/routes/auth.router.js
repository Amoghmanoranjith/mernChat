import { Router } from "express";
import passport from 'passport';
import { config } from "../config/env.config.js";
import { checkAuth, logout, redirectHandler, sendOtp, updateFcmToken, verifyOtp } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { fcmTokenSchema, verifyOtpSchema } from "../schemas/auth.schema.js";
export default Router()
    .get("/send-otp", verifyToken, sendOtp)
    .post("/verify-otp", verifyToken, validate(verifyOtpSchema), verifyOtp)
    .get("/verify-token", verifyToken, checkAuth)
    .patch("/user/update-fcm-token", verifyToken, validate(fcmTokenSchema), updateFcmToken)
    .get("/logout", logout)
    .get("/google", passport.authenticate("google", { session: false, scope: ["email", "profile"] }))
    .get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${config.clientUrl}/auth/login` }), redirectHandler);
