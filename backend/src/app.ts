import express from "express";
import http from "http";
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
let generalUsernames: string[] = [];
let users = new Map();
io.on("connection", (socket) => {
  //Listens for new clients connecting via Socket.IO. Each connected client gets a socket object,
  //  This function runs once per connected client.
  //  The "connection" string is a event name,"connection" is a special built-in Socket.IO event that fires whenever a new client connects to the server.
  console.log("user connected", socket.id);
  socket.on("join", (Username) => {
    socket.join("general");
    socket.data.username = Username;
    generalUsernames.push(Username);
    users.set("general", generalUsernames);

    io.to("general").emit("take_usernames_and_roomId", {
      names: generalUsernames,
      roomId: "general",
    });
  });
  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", {
      Username: socket.data.username,
      data,
    });
    console.log(data, socket.data.username);
  });
  socket.on("disconnect", () => {
    generalUsernames = generalUsernames.filter(
      (cur) => socket.data.username !== cur,
    );
    io.emit("take_usernames_and_roomId", {
      names: generalUsernames,
      roomId: "general",
    });
    console.log("user disconnected", socket.id);
  });
});
server.listen(4000, () => {
  console.log("server running in port 4000");
});
