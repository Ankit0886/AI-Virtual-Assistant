import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import { MdArrowBack } from "react-icons/md";
import { RiImageAddLine } from "react-icons/ri";
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { userDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const Customize = () => {

  const { serverUrl, userData, setuserData, frontendImage, setFrontendImage,
    backendImage, setBackendImage, selectImage, setSelectImage } = useContext(userDataContext)
  const Navigate = useNavigate()
  const inputImage = useRef()
  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))

  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010139] flex justify-center items-center 
        flex-col p-[20px]'>
      <MdArrowBack className='absolute top-[30px] left-[30px] text-white w-[25px] h-[20px] cursor-pointer'
        onClick={() =>
          Navigate("/")} />

      <h1 className='text-white text-[36px] text-center mb-[40px]'>
        Select your <span className='text-blue-300'>Assistant Image</span></h1>



      <div className='w-full max-w[900px] flex justify-center items-center flex-wrap gap-[15px]'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-blue border-2 border-[#0000a5] rounded-2xl overflow-hidden
          hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white justify-center items-center
          flex ${selectImage == "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`} onClick={() => {
            inputImage.current.click()
            setSelectImage("input")
          }}>

          {!frontendImage && <RiImageAddLine className='text-white w-[50px] h-[50px]' />}
          {frontendImage && <img src={frontendImage} className='w-full h-full object-cover' />}

        </div>

        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
      </div>
      {selectImage && <button className='min-w-[140px] h-[50px] text-[18px] font-semibold bg-blue-500 text-white
      hover:bg-blue-950 border-2 border-white rounded-full mt-[30px] cursor-pointer'
        onClick={() => Navigate("/customize2")}>Next</button>}


    </div>
  )
}

export default Customize
