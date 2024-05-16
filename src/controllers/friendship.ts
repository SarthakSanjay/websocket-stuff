import { PrismaClient } from "@prisma/client"
import { CustomRequest } from "../middleware/auth"
const prisma = new PrismaClient()


export const addFriend = async(req,res) =>{
    // const userId = req.user
    const {friendId , userId} = req.body
    const user = await prisma.user.findUnique({
        where:{
            id:userId
        }
    })
    if(!user){
        return res.status(404).json({
            "msg":"user don't exist"
        })
    }
    const friend = await prisma.user.findUnique({
        where:{
            id:friendId
        }
    })
    if(!friend){
        return res.status(400).json({
            "msg":"user don't exist"
    })
    }

    const establishFriendship = await prisma.friendship.create({
        data:{
            userId:userId,
            friendId:friendId
        }
    })

    res.status(200).json({
        msg:"friendship establised",
        establishFriendship
    })
}

export const getAllUserFriends = async(req:CustomRequest,res) =>{
    const {id} = req.user
    const user = await prisma.user.findUnique({
        where:{
            id:id
        }
    })
    if(!user){
        return res.status(400).json({
            msg:"user not found"
        })
    }
    
    const friends = await prisma.friendship.findMany({
        where:{
            userId:id
        },
       select:{
        friend:{
            select:{
                id:true,
                username:true
            }
        }
       }
    })

    res.status(200).json({
        msg:"success",
        friends

    })

}