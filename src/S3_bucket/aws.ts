import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3client = new S3Client({
    region: "ap-south-1",
    credentials:{
        accessKeyId: process.env.ACCESS_KEY ,
        secretAccessKey: process.env.SECRET_KEY 
    }
})

export async function getObjectUrl(key:any){
    const command = new GetObjectCommand({
        Bucket: 'sharko-bucket',
        Key: key
    })
    const url = await getSignedUrl(s3client ,command)
    return url
}

export async function putObject(filename:string , contentType: string) {
    const command = new PutObjectCommand({
        Bucket: 'sharko-bucket',
        Key: `${contentType.split('/')[0]}s/${filename}`,
        ContentType: contentType
    })

    const url = await getSignedUrl(s3client , command)
    return url
    
}
