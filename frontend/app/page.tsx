"use client";
import React, { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

import moment from "moment";
type messageType = {
  message: string;
  timeStamp: string | Date;
};
type actualMessageType = {
  message: string;
  date: string;
  time: string;
};
let socket: Socket;
const HomePage = () => {
  const [message, setmessage] = useState<string>("");
  const [messages, setmessages] = useState<actualMessageType[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const handleSend = () => {
    if (message.trim() == "") {
      return;
    }
    const messageData = {
      message: message,
      timeStamp: new Date().toISOString(),
    };
    if (!socketRef.current) {
      return;
    }
    socketRef.current.emit("send_message", messageData);
    setmessage("");
  };
  useEffect(() => {
    socketRef.current = io("http://localhost:4000");
    socketRef.current.on("receive_message", (data: messageType) => {
      const dt = moment(data.timeStamp);

      const retrivedMessage: actualMessageType = {
        message: data.message,
        date: dt.format("YYYY-MM-DD"),
        time: dt.format("hh:mm A"),
      };

      setmessages((prev) => [...prev, retrivedMessage]);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="flex justify-center mt-10 gap-3">
        <input
          className="px-2 bg-blue-100 rounded-lg"
          value={message}
          placeholder="type your message"
          onChange={(e) => {
            setmessage(e.target.value);
          }}
        ></input>
        <Button onClick={handleSend}>send</Button>
      </div>
      <div className="flex justify-center mt-10 ">
        <div className="bg-purple-100 w-[70%] p-5 rounded-2xl flex flex-col gap-5 ">
          {messages.map((curr, i) => {
            return (
              <div key={i} className="bg-white p-2 rounded-2xl">
                <span className="p-4">{curr.message}</span>
                <div className="flex gap-5">
                  <span>{curr.date}</span>
                  <span>{curr.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
