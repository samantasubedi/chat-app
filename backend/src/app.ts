import express from "express";
import http from "http"
import { Request, Response } from "express";
import {Server} from "socket.io"
const app = express();
import cors from "cors"
import { Socket } from "socket.io";
import { emit } from "cluster";
app.use(cors())
app.get("/", (req: Request, res: Response) => {
  res.send("this is homepage");
});

const server= http.createServer(app)//Socket.IO works on top of a raw HTTP server.Here, we’re creating a Node.js HTTP server that wraps the Express app.
const io = new Server (server,{cors:{origin:"*"}}) //creates a Socket.IO server attached to our HTTP server

io.on("connection",(socket)=>{              //Listens for new clients connecting via Socket.IO. Each connected client gets a socket object, 
                                         // which represents their connection to the server.  This function runs once per connected client.
                                            //  The "connection" string is a event name,"connection" is a special built-in Socket.IO event that fires whenever a new client connects to the server.
    console.log("user connected" ,socket.id)
    socket.on("message_sent",(data)=>{ //listens for a custom event named "message_sent" and runs the callback function whenever that event fires.
        io.emit("receive_message",data)
        console.log(data)

    })
    socket.on("disconnect",()=>{
        console.log("user disconnected", socket.id)
    })}
)
server.listen(4000,()=>{console.log("server running in port 4000")})