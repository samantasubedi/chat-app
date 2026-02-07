import React, { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import { Button } from "./button";
type proptype={
  setUsername:Dispatch<SetStateAction<string>>
  Username:string
  setConfirmUsername:Dispatch<SetStateAction<string>>
  socketRef:React.RefObject<Socket | null>
}
const UsernameInput = ({setUsername,Username,setConfirmUsername,socketRef }:proptype) => {
  return (
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
            setConfirmUsername(Username);
            socketRef.current?.emit("join", Username);
          }}
        >
          Join Chatroom
        </Button>
      </div>
    </div>
  );
};

export default UsernameInput;
