import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { sendVideo } from "../util/api";
import { Socket } from "socket.io-client";

interface Props {
  socket?: Socket;
  socketId: string;
}
const Home = ({ socketId, socket }: Props) => {
  const [data, setData] = useState<FormData>();
  const [num, setNum] = useState(0);
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Idle");
  useEffect(() => {
    socket?.on("status", (msg: string) => {
      console.log(msg);
      setStatus(msg);
    });
  }, [socket]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    const files = e.target.files;

    if (files?.length) {
      formData.append("vid", files[0]);
      setData(formData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>{status}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {num}
      <form
        action=""
        onSubmit={async (e) => {
          e.preventDefault();

          if (data) {
            const res = await sendVideo(data, socketId);
            setImage(res.image);
          }
        }}
      >
        <input
          type="file"
          name="vid"
          id=""
          accept="video/*"
          onChange={onChange}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {image && <img src={image} alt="" className="p-10 " />}
      <a href={image} download="Image">
        {" "}
        Download
      </a>
      <button
        onClick={() => {
          fetch("http://localhost:3001");
        }}
      >
        CLICK
      </button>
      <Link href="/other">Other</Link>
    </div>
  );
};

export default Home;
