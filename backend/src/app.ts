import express from "express";
import http from "http";
import { nanoid } from "nanoid";
import { Request, Response } from "express";
import { Server } from "socket.io";
const app = express();
import cors from "cors";
app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send("this is homepage");
});

const server = http.createServer(app); //Socket.IO works on top of a raw HTTP server.Here, we’re creating a Node.js HTTP server that wraps the Express app.
const io = new Server(server, { cors: { origin: "*" } }); //creates a Socket.IO server attached to our HTTP server

let users = new Map();

io.on("connection", (socket) => {
  //Listens for new clients connecting via Socket.IO. Each connected client gets a socket object,
  //  This function runs once per connected client.
  //  The "connection" string is a event name,"connection" is a special built-in Socket.IO event that fires whenever a new client connects to the server.
  console.log("user connected", socket.id);

  socket.on("joinGlobal", (userName) => {
    const roomId = "general";
    socket.data.username = userName;
    socket.data.roomId = roomId;
    if (!users.has(roomId)) {
      users.set(roomId, []);
    }
    const userNames = users.get(roomId);
    if (!userNames.includes(userName)) {
      userNames.push(userName);
    }
    socket.join(roomId);
    io.to(roomId).emit("take_usernames_and_roomId", {
      userNames,
      roomId,
    });
  });

  socket.on("createRoom", (userName) => {
    let roomId = nanoid(5);
    users.set(roomId, []);
    const userNames = users.get(roomId);
    userNames.push(userName);
    users.set(roomId, userNames);
    console.log(users.get(roomId), "this is hte corresponding array of names");
    socket.data.username = userName;
    socket.data.roomId = roomId;
    socket.join(roomId);
    io.to(roomId).emit("take_usernames_and_roomId", {
      userNames: users.get(roomId),
      roomId,
    });
  });
  socket.on("joinRoom", ({ userName, roomId }) => {
    if (users.has(roomId)) {
      socket.join(roomId);
      const userNames = users.get(roomId);
      userNames.push(userName);
      socket.data.username = userName;
      socket.data.roomId = roomId;
      console.log(users.get(roomId), "are all users connected");
      io.to(roomId).emit("take_usernames_and_roomId", {
        userNames: users.get(roomId),
        roomId,
      });
      io.emit("room found");
    } else {
      console.log(users.get(roomId), "room not found");
      io.emit("invalid roomId");
    }
  });
  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", {
      userName: socket.data.username,
      data,
    });
    console.log(data, socket.data.username);
  });
  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (roomId) {
      let userNames = users.get(roomId);
      console.log(userNames);
      userNames = userNames.filter(
        (cur: string) => socket.data.username !== cur,
      );
      users.set(roomId, userNames);
      io.to(roomId).emit("take_usernames_and_roomId", {
        userNames: users.get(roomId),
        roomId,
      });
      console.log("user disconnected", socket.id);
    }
  });
});
server.listen(4000, () => {
  console.log("server running in port 4000");
});
