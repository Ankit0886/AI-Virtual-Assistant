import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/Voice.gif"
import userImg from "../assets/user.gif"
import { RiMenuUnfold4Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";



const Home = () => {
  const { userData, serverUrl, setuserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [aiText, setAiText] = useState("")
  const [userText, setUserText] = useState("")
  const [ham, setHam] = useState(false)
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis
  const isCallingRef = useRef(false);


  const handleLogOut = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/auth/logout`,
        { withCredentials: true })
      setuserData(null)
      navigate("/signin")
    } catch (error) {
      setuserData(null)
      console.log(error)
    }
  }


  // const startRecognition=()=>{
  //   try {
  //     recognitionRef.current?.start();
  //     setListening(true);
  //   } catch (error) {
  //     if(!error.message.includes("Start")){
  //       console.error("Recognition error:", error);
  //     }
  //   }
  // };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterence = new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN') || voices.find(v => v.lang.startsWith("hi"));
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true
    utterence.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
    }
    synth.cancel()
    synth.speak(utterence)
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }

    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === "youtube_search" || type === 'youtube_play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };

    const recognition = new SpeechRecognition()
    recognition.continuous = true,
      recognition.lang = 'en-US'

    recognitionRef.current = recognition

    const safeRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start()
        }
        catch (err) {
          if (err.name !== "InvalidStateError") {
            console.error("Start error:", err);
          }

        }
      }

    }

    recognition.onStart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        // This is intentional — do nothing
        return;
      }
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

      const greeting = new SpeechSynthesisUtterance
      (`Hello ${userData.name}, what can i help you with?`);
      greeting.lang = 'hi-IN';
      window.speechSynthesis.speak(greeting);


    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim()

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.abort()
        isRecognizingRef.current = false
        setListening(false)

        if (isCallingRef.current) return;
        isCallingRef.current = true;
        try {
          const data = await getGeminiResponse(transcript)

          if (!data || !data.response) {
            speak("Sorry, I didn't understand that.")
            return
          }
          handleCommand(data)
          setAiText(data.response)
          setUserText("")
        } finally {
          setTimeout(() => {
            isCallingRef.current = false;
          }, 4000); // increase delay
        }

      }
    }
    const fallBack = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition()
      }
    }, 10000)
    safeRecognition()
    return () => {
      recognition.abort();
      isRecognizingRef.current = false
      clearInterval(fallBack)
    }

  }, [])

  return (

    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#000043] flex justify-center items-center 
        flex-col gap-[10px] '>

      <RiMenuUnfold4Fill className='lg:hidden text-white absolute top-[20px] right-[20px] w-[40px]
          h-[40px]' onClick={() => setHam(true)} />

      <div className={`absolute top-0 w-full h-full bg-[#00000041] backdrop-blur-lg lg:hidden p-[20px] flex flex-col
      gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>

        <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[30px]
          h-[30px]' onClick={() => setHam(false)} />

        <button className='min-w-[150px] h-[60px] text-[18px] font-semibold bg-white text-black rounded-full 
       right-[20px] cursor-pointer' onClick={handleLogOut}>Log out</button>

        <button className='min-w-[150px] h-[60px] text-[18px] font-semibold bg-white text-black rounded-full 
         px-[20px] py-[10px] cursor-pointer' onClick={() => navigate("/customize")}>Customize your Assistant </button>

        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-[18px]'>History</h1>

        <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
          {userData.history?.map((his, index) => (
            <div key={index} className='text-white text-[16px] w-full h-[30px]'>{his}</div>

          ))}
        </div>

      </div>

      <button className='min-w-[140px] h-[50px] text-[18px] font-semibold bg-white text-black rounded-full absolute
           hidden lg:block top-[20px] right-[20px] mt-[30px] cursor-pointer' onClick={handleLogOut}>Log out</button>

      <button className='min-w-[140px] h-[50px] text-[18px] font-semibold bg-white text-black rounded-full absolute
          hidden lg:block top-[100px] right-[20px] mt-[30px] px-[20px] py-[10px] cursor-pointer' onClick={() => navigate("/customize")}>Customize your Assistant  </button>

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg mt-[60px]'>

        <img src={userData.assistantImage} className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>

      {!aiText && <img src={userImg} alt="" className='w-[150px]' />}
      {aiText && <img src={aiImg} alt="" className='w-[150px]' />}

      <h1 className='text-white'>{userText ? userText : aiText ? aiText : null}</h1>


    </div>
  )
}

export default Home
