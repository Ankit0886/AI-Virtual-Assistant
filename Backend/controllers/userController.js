import { response } from 'express'
import cloudinary from '../config/cloudinary.js'
import geminiResponse from '../Gemini.js'
import User from '../models/user.models.js'
import moment from "moment"

// signup controller 
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: "Get current user error" })

    }

}

export const updateUser = async (req, res) => {
    try {
        const userId = req.userId
        const { assistantName, assistantImage } = req.body
        const user = await User.findByIdAndUpdate(userId, { assistantName, assistantImage }, { new: true }).select("-password")
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: "Update user error" })

    }

}
// update assistant details
export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body
        let assistantImage;

        // upload image to cloudinary if file is uploaded
        if (req.file) {
            assistantImage = await cloudinary(req.file.path)
        }
        else {
            assistantImage = imageUrl
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            assistantName, assistantImage
        }, { new: true }).select("-password")
        return res.status(200).json(user)

    } catch (error) {
        return res.status(400).json({ message: "Update assistant error" })
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body
        const user = await User.findById(req.userId);
        user.history.push(command)
        user.save()
        const userName = user.name
        const assistantName = user.assistantName
        const result = await geminiResponse(command, assistantName, userName)

        if (!result) {
            return res.status(500).json({
                response: "AI service is temporarily unavailable."
            })
        }
        const jsonMatch = result.match(/{[\s\S]*}/)
        if (!jsonMatch) {
            return res.status(400).json({ response: "Sorry, I can't understand" })
        }
        let gemResult;
        try {
            gemResult = JSON.parse(jsonMatch[0]);
        } catch (error) {
            if (!gemResult.type || !gemResult.userInput) {
                return res.status(400).json({
                    response: "Invalid AI response structure."
                });
            }
        }
        const type = gemResult.type


        switch (type) {
            case 'get_date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current date is ${moment().format("YYYY-MM-DD")}`
                })

            case 'get_time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current time is ${moment().format("hh:mm A")}`
                })

            case 'get_day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format("dddd")}`
                })

            case 'get_month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format("MMMM")}`
                })

            case 'google_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'general':
            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
            case 'weather_show':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response
                })

            default:
                return res.status(400).json({
                    response: "I didn't understand that command."
                })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            response: "Ask to assistant error"
        })
    }
}