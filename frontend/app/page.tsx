"use client";
import React, { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useState } from "react";
import { setMaxIdleHTTPParsers } from "http";
import { io } from "socket.io-client";
type messageType = {
  message: string;
  timeStamp: string;
};
let socket: Socket;
const HomePage = () => {
  const [message, setmessage] = useState<string>("");
  const [messages, setmessages] = useState<messageType[]>([]);
  const socketRef= useRef<Socket|null>(null)
  const handleSend = () => {
    if (message.trim() == "") {
      return;
    }
    const messageData = {
      message: message,
      timeStamp: new Date().toISOString(),
    };
    if(!socketRef.current){return}
    socketRef.current.emit("send_message", messageData);
    setmessage("");
  };
  useEffect(() => {
      socketRef.current = io("http://localhost:4000");
    socketRef.current.on("receive_message", (data) => {
      setmessages((prev) => [...prev, data]);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  return (
    <div>
      <span>your message</span>
      <input
        value={message}
        onChange={(e) => {
          setmessage(e.target.value);
        }}
      ></input>
      <button onClick={handleSend}>send</button>
      <div >
        {messages.map((curr) => {
          return (
            <div key={curr.timeStamp}>
              <span>
                {curr.message} ---- {curr.timeStamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
