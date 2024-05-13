import express from 'express'
import userRouter from './routes/user'
import messageRouter from './routes/message'

const app = express()
app.use(express.json())

app.use("/user",userRouter)
app.use("/message", messageRouter)

app.get('/', (req,res)=>{
    res.send('express server is on')
})

app.listen(3000 , ()=>{
    console.log('express server listining on port 3000');
})