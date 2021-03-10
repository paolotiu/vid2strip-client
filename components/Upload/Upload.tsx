import React from "react";
import UploadSvg from "public/upload.svg";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  vidName?: string;
  isDragging: boolean;
  data: FileState;
  dispatch: React.Dispatch<Action>;
}

type ActionTypes =
  | "SET_DROP_DEPTH"
  | "SET_IN_DROP_ZONE"
  | "SET_FILE"
  | "REMOVE_FILE";

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

export const Upload = ({ onChange, vidName, dispatch, data }: Props) => {
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_IN_DROP_ZONE", isInDropZone: true });
    dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth + 1 });
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_DROP_DEPTH", dropDepth: --data.dropDepth });

    if (data.dropDepth > 0) return;
    dispatch({ type: "SET_IN_DROP_ZONE", isInDropZone: false });
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const file = e.dataTransfer.files[0];
    if (file && file.type.includes("video")) {
      const formData = new FormData();
      formData.append("vid", file);
      dispatch({ type: "SET_FILE", file: formData, name: file.name });
      dispatch({ type: "SET_DROP_DEPTH", dropDepth: 0 });
      dispatch({ type: "SET_IN_DROP_ZONE", isInDropZone: false });
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClear = () => {
    dispatch({ type: "REMOVE_FILE" });
  };
  return (
    <div
      className={`relative grid w-full gap-5 px-4 py-8 bg-gray-100  rounded justify-items-center transition duration-300 ${"border"}`}
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => handleDragLeave(e)}
    >
      <UploadSvg className="w-20" />
      {vidName && <p className="py-3 text-xs text-center"> {vidName}</p>}
      <div>
        <button className="p-2 px-3 text-black transition transform bg-gray-200 rounded cursor-pointer hover:scale-105">
          <label htmlFor="vid" className="cursor-pointer">
            Upload Video
          </label>
        </button>
        <input
          type="file"
          name="vid"
          id="vid"
          accept="video/*"
          onChange={onChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-center text-gray-400">
        * Drag and drop a video or click the button.
      </p>
      <button
        className="absolute p-1 text-sm rounded right-5 top-2"
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  );
};
