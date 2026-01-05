import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({ image }) => {

    const { serverUrl, userData, setuserData, frontendImage, setFrontendImage,
      backendImage, setBackendImage, selectImage, setSelectImage } = useContext(userDataContext);

    return (
        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-blue border-2 border-[#0000a5] rounded-2xl overflow-hidden
            hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white
            ${selectImage == image? "border-4 border-white shadow-2xl shadow-blue-950":null}`}
            onClick={()=>{setSelectImage(image)
            setSelectImage(image)
            setFrontendImage(null)
            setBackendImage(null)
            }}>
                <img src={image} className='h-full object-cover' />

        </div>
    )
}

export default Card
