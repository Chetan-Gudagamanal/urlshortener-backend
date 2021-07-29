import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import {handleRegister} from "./controllers/handleRegister.js"
import {handleVerifyRegister} from "./controllers/handleVerifyRegister.js"
import {handleLogin} from "./controllers/handleLogin.js"
import {handleForgotPassword} from "./controllers/handleForgotPassword.js"
import {handleResetPassword} from './controllers/handleResetPassword.js'
import {handleChangePassword} from "./controllers/handleChangePassword.js"
import {handleUrlShortener} from "./controllers/handleUrlShortener.js"
import {handleRedirectFromShortUrl} from "./controllers/handleRedirectFromShortUrl.js"
import { shortUrls } from "./models/UrlSchema.js"
import {auth} from "./middleware/auth.js"

const app=express()
app.use(cors())
app.use(express.json())
const port=process.env.PORT || 3001

const url=process.env.MONGODB_URI  ||  "mongodb://localhost/url_shortner_DB"
const db=await mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.get("/",(req,res)=>{
  console.log("Welcome")
  res.json("Welcome")
})

//handle registration details sent from user also send email verification link to user email
app.post("/register",(req,res)=>{handleRegister(req,res,db)})

//verify registered email, and set user as active if verified
app.post("/verify_email/:id/:token",(req,res)=>{handleVerifyRegister(req,res,db)})

//handle login details sent from user
app.post("/login", (req,res)=>{handleLogin(req,res)})

//if user forgot password, generate token and send it to user email
app.post("/forgot_password",(req,res)=>{handleForgotPassword(req,res)})

//handle verification of token, when user clicks on password reset link
app.post("/reset_password/:id/:token",(req,res)=>{handleResetPassword(req,res)})

//handle new password details sent from user, and update password in database
app.patch("/change_password/:id/:token",(req,res)=>{handleChangePassword(req,res)})

//handle authorization, to secure some end points
app.get("/check_authorized", auth,(req,res)=>{res.status(200).json("Success")})

//handle long url sent from user and return short url, with additional authorization check(which might not be necessory)
app.post("/url_shortener",auth,(req,res)=>{handleUrlShortener(req,res)})

//handle short urls clicked by user, and return original url
app.get("/short/:shortUrlToken",(req,res)=>{handleRedirectFromShortUrl(req,res)})

//get all short urls in database
app.get("/allShortUrls",async(req,res)=>{
  try{
    res.status(200).json(await shortUrls.find())
  }catch(err){
    res.status(500).json(err)
  }
})

//get all urls generated in last month
app.get("/monthReport",async (req,res)=>{
  let monthDateIso=new Date(new Date() - 30 * 60 * 60 * 24 * 1000).toISOString()
  const monthData= await shortUrls.find({createdAt:{$gt: monthDateIso}})
  .then(response=>res.json(response))
})

app.listen(port,()=>{console.log("Server started on port",port)})