import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { CustomRequest } from "../middleware/auth"
const prisma = new PrismaClient()

export const registerUser = async(req,res)=>{
    const {username , email , password} = req.body
    
    const user = await prisma.user.findUnique({
        where:{
            email:email,
            username:username
        }
    })

    if(!user){
        const token = jwt.sign(
            {
                username: username,
                email:email
            },
            process.env.TOKEN_SECRET
        )
      const hashedPassword = bcrypt.hashSync(password, 10);
      const registeredUser =  await prisma.user.create({
            data:{
                username:username,
                email:email,
                password:hashedPassword,
                token:token
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
    const {credential ,password} = req.body
    
    const user = await prisma.user.findFirst({
        where:{
            OR:[
              {  username:credential},
              {  email:credential}
            ]
        }
    })

    if(!user){
        return res.status(404).json({
            msg:"User not found"
        })
    }
    if(!(bcrypt.compareSync(password, user.password))){
        return res.status(404).json({
            msg:"password is incorrect"
        })
    }
    res.status(200).json({
        msg:"logged in succussfully",
        token : user.token
    })
}

export const getAllUser = async(req :CustomRequest,res) =>{
    const {id} = req.user
    const user = await prisma.user.findUnique({
        where:{id:id}
    })
    if(!user){
        return res.status(401).json({msg:"not authorized"})
    }

    const allUser = await prisma.user.findMany()
    res.status(200).json({
        msg:"success",
        allUser
    })
}