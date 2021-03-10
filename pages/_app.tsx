import "../styles/globals.css";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

function MyApp({ Component, pageProps }: AppProps) {
  const [socket, setSocket] = useState<Socket>();
  const [id] = useState(Math.random().toString(36).substr(2, 9));
  useEffect(() => {
    // Socket connection
    const socket = io(process.env.API_URL || "http://localhost:3001");
    socket.emit("connectInit", id);

    setSocket(socket);

    return () => {
      // Close socket one user closes website
      socket.close();
    };
  }, []);
  return <Component {...pageProps} socket={socket} socketId={id} />;
}

export default MyApp;
