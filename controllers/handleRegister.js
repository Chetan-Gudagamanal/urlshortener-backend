import {urlUsers} from "../models/UserSchema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {handleSendRegistrationEmail} from "./handleSendRegistrationEmail.js"

export const handleRegister=async(req,res,db)=>{
    const {firstName,lastName,userEmail,password}=req.body
    console.log(password)
    let existingUser;
    if(existingUser=await urlUsers.findOne({userEmail:userEmail})){
        if(existingUser.active){
            res.status(500).json("User already exists")
        }
        else{
            try{
                await urlUsers.deleteOne(existingUser)
                //const urlUser=await saveUserRegistrationDetails(firstName,lastName,userEmail,password,res)
                const salt = await bcrypt.genSalt(10)
                const passwordHash= await bcrypt.hash(password,salt)
                
                const urlUser=new urlUsers(
                    {
                        firstName,
                        lastName,
                        userEmail,
                        password:passwordHash,
                        active:false
                    }
                )
                
                await urlUser.save()

                const secretKey=process.env.SECRET_KEY || "my_secret";
                const key=secretKey+urlUser.password
                const payload={
                    email:urlUser.userEmail,
                    id:urlUser._id
                }
                const token=jwt.sign(payload,key,{expiresIn:"10m"})
                const verificationLink=`${process.env.CLIENT_BASE_URL}/verify_email/${urlUser._id}/${token}`
                // console.log(urlUser)
                console.log(verificationLink)
                handleSendRegistrationEmail(urlUser.userEmail,verificationLink)
                res.status(200).json(urlUser)
            }
            catch(err){
                res.status(500).json(err)
            }
        }
    }
    else{
        try {
            

            const salt = await bcrypt.genSalt(10)
            const passwordHash= await bcrypt.hash(password,salt)
            
            const urlUser=new urlUsers(
                {
                    firstName,
                    lastName,
                    userEmail,
                    password:passwordHash,
                    active:false
                }
            )
            
            await urlUser.save()

            const secretKey=process.env.SECRET_KEY || "my_secret";
            const key=secretKey+urlUser.password
            const payload={
                email:urlUser.userEmail,
                id:urlUser._id
            }
            const token=jwt.sign(payload,key,{expiresIn:"20m"})
            const verificationLink=`${process.env.CLIENT_BASE_URL}/verify_email/${urlUser._id}/${token}`
            // console.log(urlUser)
            console.log(verificationLink)
            handleSendRegistrationEmail(urlUser.userEmail,verificationLink)
            res.status(200).json(urlUser)
        } catch (error) {
            res.status(500).json(error)
        } 
    }
}
