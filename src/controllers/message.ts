import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const directMessage = async(req,res) =>{
    // const senderId = req.user
    const { receiverId ,senderId ,text} = req.body 

    const receiver = await prisma.user.findUnique({
        where:{
            id:receiverId
        }
    })
    if(!receiver){
        return res.status(404).json({
            msg:"User does not exists"
        })
    }

    const message = await prisma.message.create({
        data:{
            senderId:senderId,
            receiverId:receiverId,
            text:text
        }
    })

    res.status(200).json({
        msg:"DMed successfully",
        message
    })
}