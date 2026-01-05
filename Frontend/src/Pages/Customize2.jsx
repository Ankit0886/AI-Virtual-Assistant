import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { MdArrowBack } from "react-icons/md";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const { userData, backendImage, serverUrl, selectImage, setuserData } = useContext(userDataContext)
  const [AssistantName, setAssistantName] = useState(userData?.AssistantName || "")
  const navigate = useNavigate()

  const handleUpateAssistant = async () => {
    // api call to update assistant name
    try {
      let formData = new FormData()
      formData.append("assistantName", AssistantName)
      if (backendImage) {
        formData.append("assistantImage", backendImage)
      }
      else{
        formData.append("imageUrl", selectImage)
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials: true})

      console.log(result.data)
      setuserData(result.data)
      navigate("/")

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010139] flex justify-center items-center 
        flex-col p-[20px] relative'>

          <MdArrowBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[20px] cursor-pointer'
          onClick={()=>
          navigate("/customize")}/>

      <h1 className='text-white text-[36px] text-center mb-[40px]'>
        Select your <span className='text-blue-300'>Assistant Name</span></h1>


      <input type="text" placeholder='eg: shifra' className='w-full h-[60px] max-w-[600px] outline-none
        border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] 
        rounded-full text-[18px]' required onChange={(e) => setAssistantName(e.target.value)} value={AssistantName} />

      {AssistantName && <button className='min-w-[300px] h-[50px] text-[18px] font-semibold bg-blue-500 text-white
      hover:bg-blue-950 border-2 border-white rounded-full mt-[30px] cursor-pointer'
        onClick={()=>{ 
        handleUpateAssistant()

        }

        }>Finally Create your Assistant</button>}

    </div>
  )
}

export default Customize2
