import { shortUrls } from "../models/UrlSchema.js"

export const handleRedirectFromShortUrl=async(req,res)=>{
    const {shortUrlToken}=req.params
    try{
        let urlEntry;
        if(urlEntry=await shortUrls.findOne({shortUrlToken})){
            res.status(200).json(urlEntry)
            urlEntry.urlHitCount+=1;
            urlEntry.save()
        }else{
            res.status(500).json("Invalid url")
        }

    }catch(err){
        res.status(500).json(err)
    }
}