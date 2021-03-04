import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { sendVideo, sendYoutubeLink } from "../util/api";
import { Socket } from "socket.io-client";
import { Divider } from "tiu-ui";
import { Upload } from "components/Upload/Upload";
import Progress from "components/Progress/Progress";
import Strip from "components/Strip/Strip";
interface Props {
  socket?: Socket;
  socketId: string;
}
const Home = ({ socketId, socket }: Props) => {
  const [data, setData] = useState<FormData>();
  const [isConnected, setIsConnected] = useState(false);
  const [ytLink, setYtLink] = useState("");
  const [image, setImage] = useState("");
  const [vidName, setVidName] = useState("");
  const [progress, setProgress] = useState({ upload: 0, frames: 0, color: 0 });

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
    // On connect
    socket?.on("connect", () => {
      setIsConnected(true);
    });
    // Socket event listener
    socket?.on("status", (res: any) => {
      if (res.event === "Frames") {
        setProgress((prev) => ({ ...prev, frames: res.value }));
      } else if (res.event === "color") {
        setProgress((prev) => ({ ...prev, color: res.value }));
      } else if (res.event === "finish") {
        window.scrollTo();
      }
    });

    return () => {
      // turn off event listener on unmount
      socket?.off("status");
    };
  }, [socket]);

  if (!isConnected) {
    return <div></div>;
  }
  return (
    <div>
      <Head>
        <title>Vid2Strip</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid place-items-center ">
        <div className="grid items-center w-full gap-4 p-8 max-w-7xl justify-items-center ">
          <div className="grid w-full gap-4 p-4 pb-6 border-2 border-dashed justify-items-center">
            <Upload onChange={onChange} vidName={vidName} />
            <div className="w-full">
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
          </div>
          <div>
            <form action="" onSubmit={submitHandler}>
              <button type="submit">Submit</button>
            </form>
          </div>
          {progress.upload ? (
            <div className="grid items-center w-full grid-flow-col gap-10 justify-items-center py-7">
              <Progress label="Upload" progress={progress.upload} />
              <Progress label="Frames" progress={progress.frames} />
              <Progress label="Colors" progress={progress.color} />
            </div>
          ) : (
            ""
          )}
          {image && (
            <div>
              <Strip src={image} />
            </div>
          )}
        </div>
      </main>
    </div>
  );

  async function submitHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    setProgress({ upload: 0, frames: 0, color: 0 });
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
