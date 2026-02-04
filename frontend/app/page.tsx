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
  const [Username, setUsername] = useState("");
  const [ConfirmUsername, setConfrmUsername] = useState("");
  const [allusers, setallusers] = useState<string[]>([]);
  const elementref = useRef<HTMLDivElement | null>(null);

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
    socketRef.current.on("take_usernames", (names) => {
      setallusers(names);
    });
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
  useEffect(() => {
    const el = elementref.current;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      {!ConfirmUsername ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome!</h2>
          <p className="text-slate-500 mb-6">
            Please set a username to start chatting.
          </p>
          <div className="space-y-4">
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. ram12"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all"
              onClick={() => {
                setConfrmUsername(Username);
                socketRef.current?.emit("join", Username);
              }}
            >
              Join Chatroom
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[60%] bg-white rounded-3xl shadow-2xl  flex flex-col h-[80vh] ">
          <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full "></span>
                Online
              </p>
            </div>
            <span className="text-sm text-slate-400 font-medium">
              @{ConfirmUsername}
            </span>
          </div>
          <div className="flex">
            {/* <div className="flex  flex-col p-5 w-30 rounded-2xl rounded-l-none bg-blue-100 h-fit">
              <p className="text-sm  ">Active users</p>
          <div className="flex flex-col gap-3 break-all ">{allusers.map((curr,i)=>{return(<div key={i}>{curr}</div>)})}</div></div> */}
            <div className="flex flex-col w-64 h-full border-l border-slate-200 bg-gray-100">
              <div className="p-5 border-b border-slate-200 ">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                  Active Users
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {allusers.length} Online
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-3 ">
                {allusers.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full flex justify-center items-center font-bold bg-linear-to-br from-purple-200 to bg-purple-800 text-white">
                     <p>{user[0].toUpperCase()}</p> 
                    </div>
                    <div className="text-sm font-semibold">{user}</div>
                  </div>
                ))}
              </div>
            </div>
            <div
              ref={elementref}
              className=" h-120 flex-1 overflow-y-auto p-6 bg-slate-50/50 flex flex-col gap-4 "
            >
              {messages.map((curr, i) => {
                const isMe = curr.username === ConfirmUsername;
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl shadow-sm wrap-break-words ${
                        isMe
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                      }`}
                    >
                      {!isMe && (
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                          {curr.username}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{curr.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {curr.time} • {curr.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-2 bg-white border border-slate-200 ">
            <div className="flex gap-2 items-center bg-slate-100 p-2 rounded-2xl">
              <input
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-slate-700"
                value={message}
                placeholder="Write a message..."
                onChange={(e) => setmessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 px-5 rounded-xl text-sm font-medium transition-colors"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
