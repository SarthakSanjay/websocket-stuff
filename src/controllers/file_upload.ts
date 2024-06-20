import { putObject } from "../S3_bucket/aws"

export const uploadFiles = async(req,res) =>{
    const {filename , contentType} = req.body
    const url = await putObject(filename , contentType)
    if(!url){
        return res.status(404).json({
            msg:'Error uploading file'
        })
    }

    res.status(200).json({
        url
    })
}