import { WebSocketServer } from "ws";
import http from 'http'
import url from 'url'
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const server = http.createServer()
const wss = new WebSocketServer({ server })

interface CustomWebSocket extends WebSocket {
    userId : number
}
wss.on('connection', (connection : CustomWebSocket , req)=>{
    let userId = decodeURIComponent(url.parse(req.url, true).pathname.slice(1));
    console.log(userId);
    connection.userId = parseInt(userId)
    // @ts-ignore
    connection.on('message', async(data)=>{
        const {friendId , text} =  JSON.parse(data.toString())

        const friends = await prisma.friendship.findFirst({
            where:{
                userId:parseInt(userId),
                friendId:friendId
            }
        })
        console.log(friendId , text);
        if(!friends){
            connection.send('not friends')
            connection.close()
        }
        
        wss.clients.forEach(async(client : any)=>{
                if(client.userId === friendId){
                    await prisma.message.create({
                        data:{
                            senderId: parseInt(userId),
                            receiverId: friendId,
                            text: text
                        }
                    })
                    client.send(
                        JSON.stringify({
                            friendId: friendId,
                            text : text,
                          })
                    )
                }
            })
    })
})

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
})
