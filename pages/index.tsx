import React, { useCallback, useEffect, useReducer, useState } from "react";
import Head from "next/head";
import { sendVideo, sendYoutubeLink } from "../util/api";
import { Socket } from "socket.io-client";
import { Divider } from "tiu-ui";
import { Action, FileState, Upload } from "components/Upload/Upload";
import Progress from "components/Progress/Progress";
import Strip from "components/Strip/Strip";
interface Props {
  socket?: Socket;
  socketId: string;
}

const reducer = (state: FileState, action: Action): FileState => {
  switch (action.type) {
    case "SET_DROP_DEPTH":
      if (action.dropDepth) {
        return { ...state, dropDepth: action.dropDepth };
      }
      return state;
    case "SET_IN_DROP_ZONE":
      if (action.isInDropZone) {
        return { ...state, isInDropZone: action.isInDropZone };
      }
      return state;
    case "SET_FILE":
      if (action.file) {
        return { ...state, file: action.file, name: action.name || "" };
      }
      return state;
    case "REMOVE_FILE":
      return { ...state, file: null, name: "" };
    default:
      return state;
  }
};

const Home = ({ socketId, socket }: Props) => {
  // const [data, setData] = useState<FormData>();
  const [data, dispatch] = useReducer(reducer, {
    dropDepth: 0,
    isInDropZone: false,
    file: null,
    name: "",
  });
  const [isConnected, setIsConnected] = useState(false);
  const [ytLink, setYtLink] = useState("");
  const [image, setImage] = useState("");
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
      formData.append("vid", files[0]);
      dispatch({ type: "SET_FILE", file: formData, name: files[0].name });
      // setData(formData);
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
            <Upload
              onChange={onChange}
              vidName={data.name}
              data={data}
              dispatch={dispatch}
            />
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
    } else if (data.file) {
      const res = await sendVideo(data.file, socketId, onUploadProgress);
      setImage(res.image);
    }
  }
};

export default Home;
