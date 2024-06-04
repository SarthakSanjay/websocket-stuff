import { PrismaClient } from "@prisma/client"
import { CustomRequest } from "../middleware/auth"
const prisma = new PrismaClient()


export const sendFriendRequest = async(req:CustomRequest,res) =>{
    const userId = req.user?.id
    const {friendId} = req.body
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

     await prisma.friendRequest.create({
        data:{
            senderId:userId,
            ReceiverId:friendId
        }
    })

    res.status(200).json({
        msg:"friend request sent",
        sent: true
    })
}

export const getAllUserFriends = async(req:CustomRequest,res) =>{
    const userId = req.user?.id
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user){
            return res.status(400).json({
                msg:"user not found"
            })
        }
        
        const friends = await prisma.friendship.findMany({
            where:{
                userId:userId,
                friendshipEstablished:true
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
    } catch (error:any) {
        console.log(error.message)
    }

}

export const acceptFriendReq = async(req:CustomRequest , res) =>{
    try {
        const userId = req.user?.id
        const friendId:number = parseInt(req.body.friendId)
        const user = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })

        const friend = await prisma.user.findUnique({
            where:{
                id:friendId
            }
        })
        if(!friend || !user){
            return res.status(400).json({
                "msg":"user don't exist"
        })
        }
        const isFriend = await prisma.friendship.findFirst({
            where:{
                userId:userId,
                friendId:friendId,
            }
        })
        if(isFriend){
            return res.status(404).json({
                msg:"friendship exist already"
            })
        }
        await prisma.friendship.create({
            data:{
                userId:userId,
                friendId:friendId,
                friendshipEstablished:true
            }
        })
        await prisma.friendship.create({
            data:{
                userId:friendId,
                friendId:userId,
                friendshipEstablished:true
            }
        })
        const friendReq = await prisma.friendRequest.findFirst({
            where:{
                ReceiverId:userId,
                senderId:friendId
            }
        })
        if(!friendReq){
            return res.status(404).json({
                msg:"friend req don't exists"
            })
        }
        const deleted = await prisma.friendRequest.delete({
            where:{
                id:friendReq.id
            }
        })

        res.status(200).json({
            Accepted: true,
            deleted
        })


    } catch (error) {
        console.log(error.message);
    }
}

export const sentRequest = async(req:CustomRequest,res)=>{
    try {
        const userId = req.user?.id
        const user = await prisma.user.findUnique({where:{id:userId}})

        if(!user){
            return res.status(404).json({
                msg:"user not found"
            })
        }
        const friendReq = await prisma.friendRequest.findMany({
            where:{
                senderId:userId
            }
        })

    } catch (error) {
        console.log(error.message)
    }
}
//recived friend request
export const recivedFriendRequest = async(req:CustomRequest,res)=>{
    try {
        const userId = req.user?.id
        const friendReq = await prisma.friendRequest.findMany({
            where:{
                ReceiverId:userId
            },select:{
                id:true,
                sender:{
                    select:{
                        id:true,
                        username:true,
                        email:true
                    }
                },
                createdAt:true
            }
        })
        res.status(200).json({
            friendReq
        })
    } catch (error) {
        
    }
}