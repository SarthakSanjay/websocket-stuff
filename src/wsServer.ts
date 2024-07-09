import { WebSocketServer } from "ws";
import http from "http";
import url from "url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const server = http.createServer();
const wss = new WebSocketServer({ server });

interface CustomWebSocket extends WebSocket {
  userId: number;
}
wss.on("connection", (connection: CustomWebSocket, req) => {
  let userId = decodeURIComponent(url.parse(req.url, true).pathname.slice(1));

  connection.userId = parseInt(userId);
  // @ts-ignore
  connection.on("message", async (message) => {
    const { friendId, data, messageType, filename, contentType } = JSON.parse(
      message.toString()
    );

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

    if (messageType !== "TEXT") {
      let url = `${process.env.BUCKET_URL}/${
        contentType.split("/")[0]
      }s/${filename}.${contentType.split("/")[1]}`;

      await prisma.message.create({
        data: {
          senderId: parseInt(userId),
          receiverId: friendId,
          data: url,
          messageType: messageType,
        },
      });
    }

    if (messageType === "TEXT") {
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
        client.send(
          JSON.stringify({
            friendId: friendId,
            data: data,
            messageType: messageType,
            contentType: contentType,
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
