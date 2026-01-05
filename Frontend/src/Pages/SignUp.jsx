import React, {useState, useContext} from 'react'
import bg from "../assets/Blog.png"
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'

function SignUp ()  {
  const {serverUrl,userData, setuserData, setIsLoggedIn}= useContext(userDataContext)
  const navigate = useNavigate ()
  const  [name,setName] = useState("")
  const  [email,setEmail] = useState("")
  const  [password,setPassword] = useState("")
  const [err,setErr] = useState("")
  const [loading,setLoading]= useState(false)

  // fetch api to register user
  const handleSignup = async(e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`,{
        name,email,password
      },{withCredentials:true})
      setuserData(result.data.user)
      setIsLoggedIn(true)
      localStorage.setItem('loggedIn', 'true')
      localStorage.setItem('token', result.data.token)
      navigate("/customize")
      setLoading(false)

    } catch (error) {
      console.log(error)
      setuserData(null)
      setLoading(false)
      setErr(error.response.data.message)
    }

  }
  return (
    <div className='w-full min-h-screen bg-[center_top] sm:bg-center bg-cover bg-no-repeat flex justify-center items-center px-3 sm:px-0' 
    style={{backgroundImage:`url(${bg})`}}> 

    <form className='w-[90%] h-[600px] max-w-[500px] h-auto sm:h-[600px] bg-[#0000003d] backdrop-blur-md shadow-md 
    shadow-black rounded-md flex flex-col justify-center items-center gap-4 sm:gap-[20px] px-4 sm:px-[20px] py-6 sm:py-0' onSubmit={handleSignup}>

      <h1 className='text-white text-2xl sm:text-3xl font-semibold mb-4 sm:mb-[30px] text-center'>
        Register to  <span className='text-blue-400'>AI Virtual Assistant</span>
        </h1>

        <input type="text" placeholder='Enter your Name' className='w-full h-[50px] sm:h-[60px] outline-none
         border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2 rounded-full text-[16px] sm:text-[18px]'
         required onChange={(e)=> setName(e.target.value)} value={name}/>

         <input type="Email" placeholder='Email' className='w-full h-[50px] sm:h-[60px] outline-none
         border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2 rounded-full text-[16px] sm:text-[18px]'
         required onChange={(e)=> setEmail(e.target.value)} value={email}/>

         <div className='w-full h-[60px] sm:h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px]'>

          <input type="password" placeholder='Enter password' className='w-full h-full rounde-full outline-none bg-transparent
          text-white placeholder-gray-300 px-5 py-2 text-[16px] sm:text-[18px]'
          required onChange={(e)=> setPassword(e.target.value)} value={password}/>
         </div>

         {err.length>0 && <p className='text-red-500 text-[16px]'>*{err}</p>}

         <button className='min-w-[140px] h-[45px] sm:h-[50px] text-[16px] sm:text-[18px] font-semibold bg-white
         text-black rounded-full mt-4 sm:mt-[30px]'disabled={loading}>{loading?"loading...":"Sign up"}</button>

         <p className='text-white text-sm sm:text-[16px] cursor-pointer' onClick={()=> navigate("/signin")}>Already have an account ? <span className='text-blue-400'>Sign in</span></p>


    </form>
      
    </div>
  )
}

export default SignUp
