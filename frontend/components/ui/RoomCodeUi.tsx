import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Socket } from "socket.io-client";
type proptype = {
  roomId: string;
  setRoomId: Dispatch<SetStateAction<string>>;
  userName:string
  socketRef:React.RefObject<Socket|null>
};
const RoomCodeUi = ({ roomId, setRoomId ,userName,socketRef}: proptype) => {
  const [idInput, setIdInput] = useState("");
  return (
    <div>
      <div>Enter the Room Id</div>
      <Input
        value={idInput}
        onChange={(e) => {
          setIdInput(e.target.value);
        }}
      ></Input>
      <Button
        onClick={() => {
          setRoomId(idInput);
          
          setIdInput("");
           socketRef.current?.emit("joinRoom", { userName, roomId });
        }}
      >
        Join
      </Button>
    </div>
  );
};

export default RoomCodeUi;
