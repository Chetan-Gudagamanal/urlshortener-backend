import { urlUsers } from "../models/UserSchema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

//login will work only if urlUser.active==true
export const handleLogin=async(req,res)=>{
    const {userEmail,password}=req.body
    let urlUser;
    try{
        if(urlUser=await urlUsers.findOne({userEmail:userEmail})){
            console.log(urlUser)
            if(!urlUser.active){
                res.status(500).json("Incompleate Registration")
            }
            else{
                const flag=await bcrypt.compare(password,urlUser.password)
                if(!flag){
                    res.status(500).json("Invalid credentials")
                }
                else{
                    const payload={
                        id:urlUser._id
                    }
                    const auth_key=process.env.AUTH_KEY || "auth_key"
                    const token=jwt.sign(payload,auth_key)

                    res.status(200).json(token)
                }
            }
        }else{
            res.status(500).json("Invalid credentials")
        }
    }catch(err){
        res.status(500).json(err)
    }
    
}

