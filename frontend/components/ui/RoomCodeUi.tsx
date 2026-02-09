import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Socket } from "socket.io-client";
type proptype = {
  userName: string;
  socketRef: React.RefObject<Socket | null>;

  setShowIdInput: Dispatch<SetStateAction<boolean>>;
  setLoader:Dispatch<SetStateAction<boolean>>
  loader:boolean
};
const RoomCodeUi = ({
  userName,
  socketRef,
loader,
setLoader,
  setShowIdInput,
}: proptype) => {
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
          console.log(idInput, "thisis the room id");
          socketRef.current?.emit("joinRoom", { userName, roomId: idInput });
          setLoader(true)
        }}
      >
        {loader?"Joining":"Join"}
      </Button>
    </div>
  );
};

export default RoomCodeUi;
