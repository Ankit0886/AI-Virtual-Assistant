import genToken from "../config/token.js"
import User from "../models/user.models.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({ message: "Email already exists !" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters !" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })


        // user id save in cookies using jwt token
        const token = await genToken(user._id)

        // send response in cookies
 
        res.cookie("token", token, {
            httpOnly: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
            sameSite: "None",
            secure: true
        })

        return res.status(201).json({user, token})
    } catch (error) {
        return res.status(500).json({
            message: `sign up Error ${error}
        `})
    }
}



export const Login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email does not exists !" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials !" })
        }

        // user id save in cookies using jwt token
        const token = await genToken(user._id)

        // send response in cookies
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
            sameSite: "None",
            secure: true
        })
        return res.status(200).json({user, token})

    } catch (error) {
        return res.status(500).json({
            message: `login Error ${error}
        `})
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "lax", secure: false })
        return res.status(200).json({message:"Logged out successfully"})
    }
    catch (error) {
        return res.status(500).json({
            message: `logout Error ${error}
        `})

    }

}
