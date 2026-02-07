"use client";
import React, { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import "dotenv/config";
import UsernameInput from "@/components/ui/UsernameInput";
import moment from "moment";
import ChatUi from "@/components/ui/ChatUi";
import { url } from "inspector";
type sentMessageType = {
  message: string;
  timeStamp: string | Date;
};
export type actualMessageType = {
  message: string;
  date: string;
  time: string;
  username: string;
};
let socket: Socket;

const HomePage = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setmessages] = useState<actualMessageType[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [Username, setUsername] = useState<string>("");
  const [ConfirmUsername, setConfirmUsername] = useState("");
  const [allUsers, setallUsers] = useState<string[]>([]);
  const elementref = useRef<HTMLDivElement | null>(null);
  const URL: string = process.env.NEXT_PUBLIC_URL!;

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
    setMessage("");
  };
  useEffect(() => {
    if (!URL) return;
    socketRef.current = io(URL);

    socketRef.current.on("take_usernames", (names) => {
      setallUsers(names);
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
  }, [URL]);

  useEffect(() => {
    const el = elementref.current;
    if (!el) {
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center md:p-4 font-sans">
      {!ConfirmUsername ? (
        <UsernameInput
          setUsername={setUsername}
          Username={Username}
          setConfirmUsername={setConfirmUsername}
          socketRef={socketRef}
        />
      ) : (
        <ChatUi
          ConfirmUsername={ConfirmUsername}
          allUsers={allUsers}
          elementRef={elementref}
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
        />
      )}
    </div>
  );
};

export default HomePage;
