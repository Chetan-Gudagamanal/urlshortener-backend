import mongoose from "mongoose"

const shortUrlSchema=mongoose.Schema(
    {
        longUrl:{
            type:String,
            required:true
        },
        shortUrlToken:{
            type:String,
            required:true
        },
        shortUrl:{
            type:String,
            required:true
        },
        createdAt:{
            type:String,
            required:true
        },
        urlHitCount:{
            type:Number,
            default:0
        }
    }
)

export const shortUrls=mongoose.model("shortUrl",shortUrlSchema)