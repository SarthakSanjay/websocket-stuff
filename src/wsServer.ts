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
    let userId = url.parse(req.url, true).pathname.slice(1);
    connection.userId = parseInt(userId)
    //@ts-ignore
    connection.on('message', async(data)=>{
        const {friendId , message} =  JSON.parse(data.toString())
        const friends = await prisma.friendship.findFirst({
            where:{
                //@ts-ignore
                userId:parseInt(userId),
                friendId:friendId
            }
        })
        if(!friends){
            console.log('not friends');
            connection.send('not friends')
            connection.close()
        }
        wss.clients.forEach((client : any)=>{
                if(client.userId === friendId){
                    client.send(
                        JSON.stringify({
                            friendId: friendId,
                            text : message,
                          })
                    )
                }
            })
    })
})

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
})
