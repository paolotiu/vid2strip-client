import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { sendVideo, sendYoutubeLink } from "../util/api";
import { Socket } from "socket.io-client";
import { CircleProgress, Divider } from "tiu-ui";
import { Upload } from "components/Upload/Upload";
interface Props {
  socket?: Socket;
  socketId: string;
}
const Home = ({ socketId, socket }: Props) => {
  const [data, setData] = useState<FormData>();
  const [ytLink, setYtLink] = useState("");
  const [image, setImage] = useState("");
  const [vidName, setVidName] = useState("");
  const [status, setStatus] = useState("Idle");
  const [progress, setProgress] = useState({ upload: 0, frames: 0 });

  // For real time prgress indicator of upload
  // Passed on to the axios request
  const onUploadProgress = useCallback((progress: any) => {
    const { loaded, total } = progress;
    const prog = Math.floor((loaded / total) * 100);

    setProgress((prev) => ({ ...prev, upload: prog }));
  }, []);

  // When file input changes
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    const files = e.target.files;

    if (files?.length) {
      setVidName(files[0].name);
      formData.append("vid", files[0]);
      setData(formData);
    }
  };

  useEffect(() => {
    // Socket event listener
    socket?.on("status", (res: any) => {
      console.log(res);
      if (res.event === "Frames") {
        setProgress((prev) => ({ ...prev, frames: res.value }));
      }
    });

    return () => {
      // turn off event listener on unmount
      socket?.off("status");
    };
  }, [socket]);

  return (
    <div>
      <Head>
        <title>{status}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid items-center gap-4 p-8 justify-items-center ">
        <Upload onChange={onChange} vidName={vidName} />
        <div className="w-full max-w-6xl">
          <Divider text="OR" />
        </div>
        <div>
          <label htmlFor="ytLink">Youtube Link:</label>
          <input
            type="text"
            name="ytLink"
            value={ytLink}
            onChange={(e) => setYtLink(e.target.value)}
            className="pl-2 ml-3 border rounded"
          />
        </div>
        <div>
          <form action="" onSubmit={submitHandler}>
            <button type="submit">Submit</button>
          </form>
        </div>
      </main>

      {image && <img src={image} alt="" className="p-10 " />}
      <a href={image} download="vid2strip">
        {" "}
        Download
      </a>

      <div className="grid items-center grid-flow-col gap-10 justify-items-center py-7">
        <div className="grid justify-items-center">
          <CircleProgress
            progress={progress.upload}
            completedProgressBarColor="#91db8f"
          />
          <p>Uploading...</p>
        </div>
        <div className="grid justify-items-center">
          <CircleProgress
            progress={progress.frames}
            completedProgressBarColor="#91db8f"
          />
          <p>Extracting Frames</p>
        </div>
      </div>
      <Link href="/other">Other</Link>
    </div>
  );

  async function submitHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    setProgress({ upload: 0, frames: 0 });
    if (ytLink) {
      const res = await sendYoutubeLink(ytLink, socketId);
      setImage(res.image);
    } else if (data) {
      const res = await sendVideo(data, socketId, onUploadProgress);
      setImage(res.image);
    }
  }
};

export default Home;
