import jwt from "jsonwebtoken"
import { urlUsers } from "../models/UserSchema.js"

export const handleVerifyRegister=async(req,res,db)=>{
    const {id,token}=req.params
    try{
        const urlUser=await urlUsers.findById(id)
        let secret_key=process.env.SECRET_KEY || "my_secret";
        const key=secret_key+urlUser.password
        const payload=jwt.verify(token,key)
        urlUser.active=true
        await urlUser.save()
        res.status(200).json(urlUser)
    }catch(err){
        res.status(500).json(err)
    }
}