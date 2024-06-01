import { PrismaClient } from "@prisma/client"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { CustomRequest } from "../middleware/auth"
import dns from 'dns/promises'

const prisma = new PrismaClient()

export const registerUser = async(req,res)=>{
  try {
      const {username , email , password} = req.body
  
      // Validate email format
      const domain = email.split('@')[1];
      let validDomain;
      let validEmail;

      try {
          validEmail = await dns.resolveMx(domain);
          validDomain = validEmail && validEmail.length > 0;
      } catch (err) {
          validDomain = false;
      }

      if (!validDomain) {
          return res.status(409).json({
              msg: "Invalid domain"
          });
      }
      
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
  } catch (error) {
    console.log(error.message)
  }
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
        console.log(bcrypt.compareSync(password, user.password));
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

export const getUserDetails = async(req:CustomRequest, res)=>{
    try {
        const userId = req.user?.id
        const user = await prisma.user.findUnique({
            where:{id : userId},
            select:{
                id:true,
                username: true,
                email:true,
            }
        })
        if(!user){
            return res.status(404).json({
                msg:"user doesn't exist"
            })
        }
        res.status(200).json({
            user
        })
    } catch (error) {
        console.log(error.message)
    }
}

export const updateUserDetail = async(req:CustomRequest , res)=>{
    try {
        const userId = req.user?.id
        const {fieldToUpdate,value, newPassword} = req.body
        // if(!fieldToUpdate || !value || !newPassword){
        //     return res.status(404).json({
        //         msg:'fields missing'
        //     })
        // }
        console.log(fieldToUpdate,',',value,',',newPassword);

        if(fieldToUpdate === 'password'){

        const user = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        if(!user){
            return res.status(404).json({msg:'cannot find user'})
        }
        const isPasswordValid = bcrypt.compareSync(value , user.password)
        if(!isPasswordValid){
            return res.status(404).json({msg:'password is incorrect'})
        }

        const newPasswordHash = bcrypt.hashSync(newPassword , 10)
         await prisma.user.update({
            where:{id:userId},
            data:{
                password:newPasswordHash
            }
        })
        res.status(200).json({
            msg: `updated user ${fieldToUpdate}`
        })
        }
        
        await prisma.user.update({
            where:{id:userId},
            data:{
                [fieldToUpdate]:value
            }
        })
        res.status(200).json({
            msg: `updated user ${fieldToUpdate}`
        })
    } catch (error) {
        console.log(error.message)
    }
}

export const searchUser = async(req,res)=>{
    try {
        const {search} = req.query
        const users = await prisma.user.findMany({
            where:{
                OR:[
                   {username:{contains: search , mode:"insensitive"}},
                   {email:{contains: search , mode:'insensitive'}}, 
                ]
            },
            select:{
                id:true,
                email:true,
                username:true
            }
        })

        res.status(200).json({
            users
        })
    } catch (error) {
        console.log(error.message)
    }
}