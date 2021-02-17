import { io } from "socket.io-client";

const socket = io("ws://localhost:3001");

socket.on("connectInit", (id: string) => {
  console.log(id);
});
export default socket;
