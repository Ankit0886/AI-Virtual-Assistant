import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import rateLimit from "express-rate-limit";
import { askToAssistant } from "./controllers/userController.js"

const app = express()
const port = process.env.PORT || 5000

// Middleware convert data in json format
app.use(express.json())

app.use(cookieParser())

// Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true
}))

// Middleware to parse JSON request bodies
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


const assistantLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        response: "Too many requests. Please wait a moment."
    }
});

app.post("/api/user/asktoassistant", assistantLimiter, askToAssistant);



// Connect to DB first, then start the server. If DB connect fails, exit.
connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log("Server is running on port " + port)
        })
    })
    .catch((err) => {
        console.error("Failed to start server due to DB connection error", err)
        process.exit(1)
    })








// gemini request

 



// app.get("/", async (req, res)=>{
//     const prompt = req.query.prompt
    
//     if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required" })
//   }

//     const data = await geminiResponse(prompt)
//     res.json(data)

// })




















// The server now only starts after a successful DB connection.
