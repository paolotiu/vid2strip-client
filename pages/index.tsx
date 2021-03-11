import React, { useCallback, useEffect, useReducer, useState } from "react";
import Head from "next/head";
import { sendVideo, sendYoutubeLink } from "../util/api";
import { Socket } from "socket.io-client";
// import { Divider } from "tiu-ui";
import { Action, FileState, Upload } from "components/Upload/Upload";
import Strip from "components/Strip/Strip";
import { apiHandler } from "util/apiHandler";
import { ProcessProgress } from "components/Progress/ProcessProgress";
interface Props {
  socket?: Socket;
  socketId: string;
}

const reducer = (state: FileState, action: Action): FileState => {
  switch (action.type) {
    case "SET_DROP_DEPTH":
      if (action.dropDepth !== undefined) {
        return { ...state, dropDepth: action.dropDepth };
      }
      return state;
    case "SET_IN_DROP_ZONE":
      if (action.isInDropZone !== undefined) {
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
  const [ytLink] = useState("");
  const [image, setImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [progress, setProgress] = useState({
    upload: 0,
    frames: 0,
    color: 0,
    completed: false,
    processing: false,
    isYt: false,
  });

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
        // Add to frames progress
        setProgress((prev) => ({ ...prev, frames: res.value }));
      } else if (res.event === "color") {
        // Add to color progress
        setProgress((prev) => ({ ...prev, color: res.value }));
      } else if (res.event === "download") {
        // yt download
        setProgress((prev) => ({ ...prev, upload: res.value }));
      } else if (res.event === "finish") {
        // Finished
        setProgress((prev) => ({
          ...prev,
          completed: true,
          processing: false,
        }));

        //Set Image
        setImage(res.value);
      }
    });

    return () => {
      // turn off event listener on unmount
      socket?.off("status");
    };
  }, [socket]);

  if (!isConnected) {
    return (
      <div className="absolute text-3xl transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        Connecting to server...
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>Vid2Strip</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-6 text-xl sm:text-2xl">a1000Frames</div>
      <main className="grid place-items-center ">
        <div className="grid items-center w-full gap-4 p-8 max-w-7xl justify-items-center ">
          <div className="grid w-full gap-4 p-4 pb-6 border-2 border-dashed justify-items-center">
            <Upload
              onChange={onChange}
              vidName={data.name}
              data={data}
              dispatch={dispatch}
              isDragging={data.isInDropZone}
            />
            {/* <div className="w-full">
              <Divider text="OR" />
            </div>
            <div>
              <label htmlFor="ytLink">Youtube Link:</label>
              <input
                type="text"
                name="ytLink"
                value={ytLink}
                onChange={(e) => setYtLink(e.target.value)}
                className="pl-2 ml-3 border rounded "
              />
            </div> */}
          </div>
          <ProcessProgress
            upload={progress.upload}
            frames={progress.frames}
            color={progress.color}
            isVisible={!!progress.upload && !progress.completed}
            isYt={progress.isYt}
          />
          <div className="grid items-center gap-3 pt-10 justify-items-center">
            <form action="" onSubmit={submitHandler}>
              <button
                type="submit"
                className={`px-5 py-2 text-2xl font-bold text-white rounded ${
                  progress.processing || (!data.file && !ytLink)
                    ? "bg-gray-200"
                    : "bg-b"
                }`}
                disabled={progress.processing || (!data.file && !ytLink)}
              >
                Generate Strip
              </button>
            </form>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          </div>

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

    // Prevent double submit
    if (progress.processing) {
      return;
    }
    // Reset error message
    setErrorMessage("");

    // Reset all prgress and start processing
    setProgress({
      upload: 0,
      frames: 0,
      color: 0,
      completed: false,
      processing: true,
      isYt: false,
    });
    // Scroll to bottom (progress stuff)
    window.scrollTo({
      top: 100000,
      behavior: "smooth",
    });

    if (ytLink) {
      const res = await apiHandler(sendYoutubeLink(ytLink, socketId));
      setProgress((prev) => ({ ...prev, isYt: true }));
      if (res.error) {
        // Check errors
        setErrorMessage(res.error.message);
        return;
      }
    } else if (data.file) {
      const res = await apiHandler(
        sendVideo(data.file, socketId, onUploadProgress)
      );
      if (res.error) {
        // Check errors
        setErrorMessage(res.error.message);
        return;
      }
    } else {
      // No input
      setProgress((prev) => ({ ...prev, processing: false }));
    }
  }
};

export default Home;
