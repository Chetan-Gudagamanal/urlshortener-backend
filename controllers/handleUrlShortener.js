import { shortUrls } from "../models/UrlSchema.js";
import { nanoid } from 'nanoid'


export const handleUrlShortener=async(req,res)=>{
    const {longUrl}=req.body
    // console.log(nanoid(10))
    try{
        
        let currentUrlDoc;
        if(currentUrlDoc=await shortUrls.findOne({longUrl})){
            console.log("true")
            res.status(200).json(currentUrlDoc)
        }
        else{
            
            const shortUrlToken=nanoid(10)
            
            const shortUrl=`${process.env.CLIENT_BASE_URL}/short/${shortUrlToken}`
            // const shortUrl=`http://localhost:3000/short/${shortUrlToken}`
            console.log(shortUrl)
            const urlEntry=new shortUrls(
                {
                    longUrl,
                    shortUrlToken,
                    shortUrl,
                    createdAt:new Date().toISOString()
                }
            )
            await urlEntry.save()
            res.status(200).json(urlEntry)
        }
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}