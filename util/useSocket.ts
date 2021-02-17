import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3001");

export const useSocket = (event: string, cb: (...args: any) => void) => {
  useEffect(() => {
    socket.on(event, cb);
    return () => {
      socket.off(event, cb);
    };
  }, []);
};
