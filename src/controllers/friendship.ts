import { PrismaClient } from "@prisma/client"
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