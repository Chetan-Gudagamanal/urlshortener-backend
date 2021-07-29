import { urlUsers } from "../models/UserSchema.js";
import jwt from "jsonwebtoken"

export const handleResetPassword =async(req,res)=>{
    const {token,id} = req.params
    let urlUser;
    try{
        if(urlUser=await urlUsers.findById(id)){
            const secret_key=process.env.SECRET_KEY || "my_secret"
            const key=secret_key+urlUser.password
            const payload=jwt.verify(token,key)
            res.status(200).json("User verified, redirecting to password change page")
        } else{
            res.status(500).json("Invalid Link")
        }
    } catch(err){
        res.status(500).json(err)
    }
    
}