import { WebSocketServer } from "ws";
import http from "http";
import url from "url";
import { PrismaClient } from "@prisma/client";
import { getObjectUrl, putObject } from "./S3_bucket/aws";

const prisma = new PrismaClient();

const server = http.createServer();
const wss = new WebSocketServer({ server });

interface CustomWebSocket extends WebSocket {
  userId: number;
}
wss.on("connection", (connection: CustomWebSocket, req) => {
  let userId = decodeURIComponent(url.parse(req.url, true).pathname.slice(1));
  // console.log(userId);
  connection.userId = parseInt(userId);
  // @ts-ignore
  connection.on("message", async (message) => {
    const { friendId, data, messageType, filename, contentType } = JSON.parse(
      message.toString()
    );
      console.log(friendId,data,messageType,filename,contentType);
    // console.log('receivedMessage',{
    //     friendId,data,messageType,filename,contentType
    // });

    const friends = await prisma.friendship.findFirst({
      where: {
        userId: parseInt(userId),
        friendId: friendId,
      },
    });

    if (!friends) {
      connection.send("not friends");
      connection.close();
      return;
    }

    let url = await getObjectUrl(`images/${filename}.${contentType.split('/')[1]}`)
    // console.log('url',url);
    if(url && messageType !== 'TEXT'){
        await prisma.message.create({
          data: {
            senderId: parseInt(userId),
            receiverId: friendId,
            data: url,
            messageType: messageType,
          },
        });

    }

    if(messageType === 'TEXT'){
        await prisma.message.create({
            data: {
              senderId: parseInt(userId),
              receiverId: friendId,
              data: data,
              messageType: messageType,
            },
          });
    }

    

    wss.clients.forEach(async (client: any) => {
      if (client.userId === friendId) {
        // console.log('sentMessage',{
        //     friendId,data,messageType,filename,contentType
        // });
        client.send(
          JSON.stringify({
            friendId: friendId,
            data: data,
            messageType: messageType,
            contentType : contentType,
            filename: filename,
            createdAt: new Date(),
          })
        );
      }
    });
  });
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
