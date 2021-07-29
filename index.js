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

app.post("/register",(req,res)=>{handleRegister(req,res,db)})

app.post("/verify_email/:id/:token",(req,res)=>{handleVerifyRegister(req,res,db)})

app.post("/login", (req,res)=>{handleLogin(req,res)})

app.post("/forgot_password",(req,res)=>{handleForgotPassword(req,res)})

app.post("/reset_password/:id/:token",(req,res)=>{handleResetPassword(req,res)})

app.patch("/change_password/:id/:token",(req,res)=>{handleChangePassword(req,res)})

app.get("/check_authorized", auth,(req,res)=>{res.status(200).json("Success")})

app.post("/url_shortener",auth,(req,res)=>{handleUrlShortener(req,res)})

app.get("/short/:shortUrlToken",(req,res)=>{handleRedirectFromShortUrl(req,res)})

app.get("/allShortUrls",async(req,res)=>{
  try{
    res.status(200).json(await shortUrls.find())
  }catch(err){
    res.status(500).json(err)
  }
})

app.get("/monthReport",async (req,res)=>{
  let monthDateIso=new Date(new Date() - 30 * 60 * 60 * 24 * 1000).toISOString()
  const monthData= await shortUrls.find({createdAt:{$gt: monthDateIso}})
  .then(response=>res.json(response))
})

app.listen(port,()=>{console.log("Server started on port",port)})