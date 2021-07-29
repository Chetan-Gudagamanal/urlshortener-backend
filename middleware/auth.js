import jwt from "jsonwebtoken"

export const auth= (req,res,next)=>{
    try{
        console.log("started verification")
        const token=req.header('x-auth-token')
        const auth_key=process.env.AUTH_KEY || "auth_key"
        jwt.verify(token,auth_key)
        console.log("verified")
        next()
    }catch(err){
        res.status(500).json(err.name)
        console.log(err.name)
    }
}