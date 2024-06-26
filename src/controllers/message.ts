import { PrismaClient } from "@prisma/client"
import { CustomRequest } from "../middleware/auth"
const prisma = new PrismaClient()

export const getChatMessages = async(req:CustomRequest ,res)=>{
    try {
        const userId = req.user?.id
        const friendId: number = parseInt(req.params.id)
        // console.log('userID',userId,'friendID',friendId);
        const messages = await prisma.message.findMany({
            where:{
                OR:[
                    {senderId: userId , receiverId: friendId},
                    {senderId: friendId , receiverId: userId},
                ]
            },select:{
                id:true,
                senderId: true,
                receiverId: true,
                data: true,
                messageType: true,
                createdAt:true
            }
            ,
            orderBy:{
                createdAt:'asc'
            }
        })
        res.status(200).json({
            messages
        })
    } catch (error) {
        res.status(404).json({
            msg:'unexpected error'
        })
    }
}

export const deleteMessage = async(req:CustomRequest , res)=>{
    const {messageIds} = req.body
    try {
        const deletedMessage = await prisma.message.deleteMany({
           where:{
            id: {
                in : messageIds
            }
           }
        })
        res.status(200).json({
            msg:'messages deleted successfully',
            deleteMessage
        })
    } catch (error) {
        res.status(404).json({
            msg:'unexpected error while deleting messages'
        })
    }
}