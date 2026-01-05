import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const userDataContext = createContext()
const UserContext = ({ children }) => {
    const serverUrl = "https://ai-virtual-assistant-fg9q.onrender.com"
    const [userData, setuserData] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [selectImage, setSelectImage] = useState(null)

    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, {withCredentials:true})
            setuserData(result.data)
            console.log(result.data)

        } catch (error) { 
            setIsLoggedIn(false)
            console.log(error)
        }
    }
    // call gemini function
    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
            return result.data
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
            handleCurrentUser()
    }, [])

    const value = {
        serverUrl, userData, setuserData, frontendImage, setFrontendImage,setIsLoggedIn,
        backendImage, setBackendImage, selectImage, setSelectImage, getGeminiResponse
    }
    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext
