import mongoose from "mongoose";

const urlUserSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        userEmail:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        active:{
            type:Boolean,
            required:true
        }
    }
)

export const urlUsers=mongoose.model("urlUser",urlUserSchema)