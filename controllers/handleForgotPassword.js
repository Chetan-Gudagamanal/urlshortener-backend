import { urlUsers } from "../models/UserSchema.js";
import jwt from "jsonwebtoken"
import {handleSendEmail} from "./handleSendEmail.js"

export const handleForgotPassword=async(req,res)=>{
    const {userEmail}=req.body
    let urlUser;
    try{
        if(urlUser=await urlUsers.findOne({userEmail:userEmail})){
            if(!urlUser.active){
                res.status(500).json("Your Registration is not complete yet, Kindly register again")
            }
            else{
                const secret_key=process.env.SECRET_KEY || "my_secret"
                const key=secret_key+urlUser.password
                const payload={
                    email:urlUser.userEmail,
                    id:urlUser._id
                }
                const token=jwt.sign(payload,key,{expiresIn:"10m"})
                const resetPasswordLink=`${process.env.CLIENT_BASE_URL}/reset_password/${urlUser._id}/${token}`
                handleSendEmail(urlUser.userEmail,resetPasswordLink)
                console.log(resetPasswordLink)
                res.status(200).json("password reset link sent")
            }
        }
        else{
            res.status(500).json("Invalid Email")
        }
    }catch(err){
        res.status(500).json(err)
    }
}