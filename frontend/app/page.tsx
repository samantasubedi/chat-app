"use client";
import React, { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";

import moment from "moment";
type sentMessageType = {
  message: string;
  timeStamp: string | Date;
};
type actualMessageType = {
  message: string;
  date: string;
  time: string;
  username: string;
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
    const messageData: sentMessageType = {
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
    socketRef.current.on("receive_message", ({ Username, data }) => {
      const dt = moment(data.timeStamp);

      const retrivedMessage: actualMessageType = {
        message: data.message,
        date: dt.format("YYYY-MM-DD"),
        time: dt.format("hh:mm A"),
        username: Username,
      };

      setmessages((prev) => [...prev, retrivedMessage]);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  const [Username, setUsername] = useState("");

  const [IsSetUsername, setIsSetUsername] = useState(false);

  return (
    <div>
      {!IsSetUsername && (
        <div>
          {" "}
          <p>set your username</p>
          <input
            value={Username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <Button
            onClick={() => {
              if(Username.trim()==""){return}
              setIsSetUsername(true);
              socketRef.current?.emit("join", Username);
              console.log("this is username in frontend", Username);
            }}
          >
            set
          </Button>
        </div>
      )}
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
                <span className="text-gray-700">{curr.username}</span>
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
