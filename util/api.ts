import axios from "axios";
export const sendVideo = async (
  data: FormData,
  socketId: string,
  onUploadProgress?: (progressEvent: any) => void
) => {
  if (!data.get("socketId")) {
    data.append("socketId", socketId);
  }
  const res = await axios.post("http://localhost:3001/vid", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: onUploadProgress,
  });

  return res.data;
};

export const testCall = async (socketId: string) => {
  const res = await axios.post("http://localhost:3001", {
    socketId,
    id: "hgey",
  });

  return res.data;
};
