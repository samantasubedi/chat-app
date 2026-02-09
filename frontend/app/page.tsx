"use client";
import React, { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { io } from "socket.io-client";
import "dotenv/config";
import UsernameInput from "@/components/UsernameInput";
import moment from "moment";
import ChatUi from "@/components/ChatUi";
import { url } from "inspector";
import RoomCodeUi from "@/components/ui/RoomCodeUi";
type sentMessageType = {
  message: string;
  timeStamp: string | Date;
  roomId: string;
};
export type actualMessageType = {
  message: string;
  date: string;
  time: string;
  userName: string;
};
let socket: Socket;

const HomePage = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setmessages] = useState<actualMessageType[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [userName, setUsername] = useState<string>("");
  const [ConfirmUsername, setConfirmUsername] = useState("");
  const [allUsers, setallUsers] = useState<string[]>([]);
  const [roomId, setRoomId] = useState("");
  const elementref = useRef<HTMLDivElement | null>(null);
  const [showIdInput, setShowIdInput] = useState(false);
  const URL: string = process.env.NEXT_PUBLIC_URL!;

  const handleSend = () => {
    if (message.trim() == "") {
      return;
    }
    const messageData: sentMessageType = {
      message: message,
      timeStamp: new Date().toISOString(),
      roomId: roomId,
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

    socketRef.current.on(
      "take_usernames_and_roomId",
      ({ userNames, roomId }: { userNames: string[]; roomId: string }) => {
        setallUsers(() => userNames);
        setRoomId(roomId);
        console.log(userNames, "this is raw usernames before setting");
        console.log(allUsers, "all users received and set in frontend");
      },
    );

    socketRef.current.on("receive_message", ({ userName, data }) => {
      const dt = moment(data.timeStamp);
      const retrivedMessage: actualMessageType = {
        message: data.message,
        date: dt.format("YYYY-MM-DD"),
        time: dt.format("hh:mm A"),
        userName,
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
          userName={userName}
          setConfirmUsername={setConfirmUsername}
          socketRef={socketRef}
          roomId={roomId}
          setRoomId={setRoomId}
          showIdInput={showIdInput}
          setShowIdInput={setShowIdInput}
        />
      ) : showIdInput ? (
        <RoomCodeUi roomId={roomId} setRoomId={setRoomId} userName={ConfirmUsername} socketRef={socketRef}/>
      ) : (
        <ChatUi
          ConfirmUsername={ConfirmUsername}
          allUsers={allUsers}
          elementRef={elementref}
          messages={messages}
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          roomId={roomId}
        />
      )}
    </div>
  );
};

export default HomePage;
