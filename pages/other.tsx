import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { testCall } from "util/api";

interface Props {
  socket?: Socket;
  socketId: string;
}

const Other = ({ socket, socketId }: Props) => {
  useEffect(() => {
    socket?.on("pong", () => {
      console.log("pong");
    });
  }, [socket]);
  return (
    <>
      <button
        onClick={() => {
          testCall(socketId);
        }}
      >
        CLICK
      </button>
      <div>HEY THERE</div>
    </>
  );
};

export default Other;
