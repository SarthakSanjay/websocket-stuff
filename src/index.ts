import express from 'express'
import userRouter from './routes/user'
import messageRouter from './routes/message'
import friendshipRouter from './routes/friendship'
import uploadRouter from './routes/file_upload'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())

app.use("/user",  userRouter)
app.use("/message", messageRouter)
app.use("/friend", friendshipRouter)
app.use('/upload' , uploadRouter)

app.get('/', (req,res)=>{
    res.send('express server is on')
})

app.listen(3000 , ()=>{
    console.log('express server listining on port 3000');
})