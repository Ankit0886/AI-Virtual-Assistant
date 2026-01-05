import express from "express"
import { askToAssistant, getCurrentUser, updateAssistant, updateUser } from "../controllers/userController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()

// Sample route for user registration

userRouter.get("/current", isAuth, getCurrentUser)
userRouter.put("/update", isAuth, updateUser)
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateAssistant)
userRouter.post("/asktoassistant", isAuth, askToAssistant)





export default userRouter