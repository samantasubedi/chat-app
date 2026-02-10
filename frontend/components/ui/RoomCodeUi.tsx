import React, { Dispatch, SetStateAction, useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Socket } from "socket.io-client";
import { Icon } from "@iconify/react";

type proptype = {
  userName: string;
  socketRef: React.RefObject<Socket | null>;

  setShowIdInput: Dispatch<SetStateAction<boolean>>;
  setLoader: Dispatch<SetStateAction<boolean>>;
  loader: boolean;
};
const RoomCodeUi = ({
  userName,
  socketRef,
  loader,
  setLoader,
  setShowIdInput,
}: proptype) => {
  const [idInput, setIdInput] = useState("");
  const handleJoin = () => {
    console.log(idInput, "thisis the room id");
    socketRef.current?.emit("joinRoom", { userName, roomId: idInput.trim() });
    setLoader(true);
  };
  return (
    <div className=" bg-slate-200 rounded-2xl p-5">
      <div className="font-bold text-2xl "> Room ID</div>
      <Input
        className="text-2xl! p-2! mt-4 h-13 bg-purple-50"
        value={idInput}
        onChange={(e) => {
          setIdInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleJoin();
          }
        }}
      ></Input>
      <div className="flex justify-center mt-4">
        <Button
          className="bg-purple-800 p-2! h-fit cursor-pointer hover:bg-purple-700 transition-colors ease-in-out duration-300 w-full font-bold text-xl"
          onClick={() => {
            handleJoin();
          }}
        >
          {loader ? (
            <div className="flex gap-3 items-center">
              <Icon icon="eos-icons:bubble-loading" />
              <div className="flex text-lg">Connecting...</div>
            </div>
          ) : (
            "Join"
          )}
        </Button>{" "}
      </div>
    </div>
  );
};

export default RoomCodeUi;
