import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const registerUser = async(req,res)=>{
    const {username , email} = req.body
    
    const user = await prisma.user.findUnique({
        where:{
            email:email,
            username:username
        }
    })

    if(!user){
      const registeredUser =  await prisma.user.create({
            data:{
                username:username,
                email:email
            }
        })

       return res.status(200).json({
            msg:"user registered successfully",
            registeredUser
        })
    }

    res.status(409).json({
        msg:"User already exists"
    })
}

export const loginUser = async(req,res) =>{
    const {username , email} = req.body
    
    const user = await prisma.user.findUnique({
        where:{
            username:username,
            email:email
        }
    })

    if(!user){
        return res.status(404).json({
            msg:"User not found"
        })
    }

    res.status(200).json({
        msg:"logged in succussfully",
        loggedIn : true
    })
}