import { urlUsers } from "../models/UserSchema.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const handleChangePassword=async(req,res)=>{
    const{id,token}=req.params
    const {newPassword}=req.body
    let urlUser;
    try{
        if(urlUser=await urlUsers.findById(id)){
            const secret_key=process.env.SECRET_KEY || "my_secret";
            const key=secret_key+urlUser.password;
            const paylod=jwt.verify(token,key)
            const salt=await bcrypt.genSalt(10)
            const newPasswordHash=await bcrypt.hash(newPassword,salt)
            urlUser.password=newPasswordHash
            await urlUser.save()
            res.status(200).json("password changed")
        }
        else{
            res.status(500).json("Invalid link")
        }
    }catch(err){
        res.status(500).json(err)
    }
}