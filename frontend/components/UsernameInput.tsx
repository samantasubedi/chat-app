import React, { Dispatch, SetStateAction, useState } from "react";
import { Socket } from "socket.io-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
type proptype = {
  setUsername: Dispatch<SetStateAction<string>>;
  userName: string;
  setConfirmUsername: Dispatch<SetStateAction<string>>;
  socketRef: React.RefObject<Socket | null>;
  roomId: string;
};
const UsernameInput = ({
  setUsername,
  userName,
  setConfirmUsername,
  socketRef,
  roomId,
}: proptype) => {
  const [error, seterror] = useState(false);
  const handlejoin = (action: "joinGlobal" | "createRoom" | "joinRoom") => {
    if (userName.length < 3) {
      seterror(true);
      return;
    }
    console.log(userName);

    setConfirmUsername(userName);
    if (action === "joinGlobal") {
      socketRef.current?.emit("joinGlobal", userName);
    } else if (action === "createRoom") {
     
      socketRef.current?.emit("createRoom", userName);
      // socketRef.current?.emit("joinRoom", { Username, roomId });
    } else if (action === "joinRoom") {
      socketRef.current?.emit("joinRoom", { userName, roomId });
    }
  };
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">
        Welcome!
      </h2>
      <p className="text-slate-500 mb-6 text-center">
        Please set a username to start chatting.
      </p>
      <div className="space-y-4">
        <Input
          className="h-12 text-[20px]!"
          placeholder="e.g. ram12"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
        ></Input>
        {error && (
          <p className="text-red-500 text-md">
            Username must be at least 3 characters!
          </p>
        )}
        <Button
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all"
          onClick={() => {
            handlejoin("joinGlobal");
            if (userName.length < 3) {
              seterror(true);
              return;
            }
            setConfirmUsername(userName);
            socketRef.current?.emit("joinGlobal", userName);
          }}
        >
          Join Global Chat
        </Button>

        <Button
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all"
          onClick={() => {
            // setaction(() => "createRoom");
            handlejoin("createRoom");
          }}
        >
          Create Room
        </Button>
        <Button
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white  cursor-pointer rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all"
          onClick={() => {
            handlejoin("joinRoom");
          }}
        >
          Join Room
        </Button>
      </div>
    </div>
  );
};

export default UsernameInput;
