import { Router } from "express";
import { getUserByUsername, testEmailHandler, udpateUser, updateNotifications } from "../controllers/user.controller.js";
import { fileValidation } from "../middlewares/file-validation.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";
import { notificationsSchema } from "../schemas/user.schema.js";

export default Router()

.get("/search",verifyToken,getUserByUsername)
.patch("/",verifyToken,upload.single("avatar"),fileValidation,udpateUser)
.patch("/notifications",verifyToken,validate(notificationsSchema),updateNotifications)
.get("/test-email",verifyToken,testEmailHandler)