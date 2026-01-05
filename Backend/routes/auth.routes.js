import express from "express"
import { Login, logout, signUp } from "../controllers/author.controller.js"

const authRouter = express.Router()

// Sample route for user registration
authRouter.post("/signup",signUp)
authRouter.post("/signin",Login)
authRouter.post("/logout",logout)

export default authRouter