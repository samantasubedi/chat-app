import React, { Dispatch, SetStateAction, useState } from "react";
import { Socket } from "socket.io-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
type proptype = {
  setUsername: Dispatch<SetStateAction<string>>;
  Username: string;
  setConfirmUsername: Dispatch<SetStateAction<string>>;
  socketRef: React.RefObject<Socket | null>;
};
const UsernameInput = ({
  setUsername,
  Username,
  setConfirmUsername,
  socketRef,
}: proptype) => {
  const [error, seterror] = useState(false);
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Welcome!</h2>
      <p className="text-slate-500 mb-6 text-center">
        Please set a username to start chatting.
      </p>
      <div className="space-y-4">
        {/* <input
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="e.g. ram12"
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
        /> */}
        <Input
        className="h-12 text-[20px]!"
          placeholder="e.g. ram12"
          value={Username}
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
            if (Username.length < 3) {
              seterror(true);
              return;
            }
            setConfirmUsername(Username);
            socketRef.current?.emit("join", Username);
          }}
        >
          Join Global Chat
        </Button>

        <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all">
          Create Room
        </Button>
        <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white  cursor-pointer rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all">
          Join Room
        </Button>
      </div>
    </div>
  );
};

export default UsernameInput;
