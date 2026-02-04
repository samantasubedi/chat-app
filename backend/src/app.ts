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
let allUsers: string[] = [];
io.on("connection", (socket) => {
  //Listens for new clients connecting via Socket.IO. Each connected client gets a socket object,
  // which represents their connection to the server.  This function runs once per connected client.
  //  The "connection" string is a event name,"connection" is a special built-in Socket.IO event that fires whenever a new client connects to the server.
  console.log("user connected", socket.id);
  socket.on("join", (Username) => {
    socket.data.username = Username;
    allUsers.push(Username);
    io.emit("take_usernames", allUsers);
  });
  socket.on("send_message", (data) => {
    //listens for a custom event named "send_message" and runs the callback function whenever that event fires.
    io.emit("receive_message", { Username: socket.data.username, data }); //.emit("event_name",data_value) is a method used to trigger a event . This line TRIGGERS (or emits) the "receive_message" event on all clients
    console.log(data, socket.data.username);
  });
  socket.on("disconnect", () => {
allUsers=allUsers.filter((cur) => socket.data.username !== cur);
  io.emit("take_usernames", allUsers);
    console.log("user disconnected", socket.id);
  });
});
server.listen(4000, () => {
  console.log("server running in port 4000");
});
