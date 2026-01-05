// isAuth find token in cookies or header and verify using jwt user id
import jwt from 'jsonwebtoken'

const isAuth =async (req, res, next) =>{
    try {
        let token = req.cookies.token
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]
        }
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        // id verify token 
        const verifyed = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = verifyed.id
        next()
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error in auth middleware"})
    }
}

export default isAuth