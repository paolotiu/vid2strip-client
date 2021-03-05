import React from "react";
import UploadSvg from "public/upload.svg";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  vidName?: string;
  data: FileState;
  dispatch: React.Dispatch<Action>;
}

type ActionTypes = "SET_DROP_DEPTH" | "SET_IN_DROP_ZONE" | "SET_FILE";

export interface FileState {
  dropDepth: number;
  isInDropZone: boolean;
  file: FormData | null;
  name: string;
}

export interface Action extends Partial<FileState> {
  type: ActionTypes;
  file?: FormData;
  name?: string;
}

export const Upload = ({ onChange, vidName, data, dispatch }: Props) => {
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    console.log(e.dataTransfer);
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const file = e.dataTransfer.files[0];
    if (file.type.includes("video")) {
      const formData = new FormData();
      formData.append("vid", file);
      dispatch({ type: "SET_FILE", file: formData, name: file.name });
    }
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div
      className="grid w-full gap-5 px-4 py-8 bg-gray-100 border rounded justify-items-center "
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
    >
      <UploadSvg className="w-20" />
      <div>
        <label htmlFor="vid" className="p-2 font-bold rounded cursor-pointer">
          Upload Video
        </label>
        <input
          type="file"
          name="vid"
          id="vid"
          accept="video/*"
          onChange={onChange}
          className="hidden"
        />
      </div>
      {vidName && <p className="text-xs"> {vidName}</p>}
    </div>
  );
};
