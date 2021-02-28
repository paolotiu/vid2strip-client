import React from "react";
import UploadSvg from "public/upload.svg";

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  vidName?: string;
}

export const Upload = ({ onChange, vidName }: Props) => {
  return (
    <div className="grid w-full max-w-6xl gap-5 px-4 py-8 bg-gray-100 border rounded justify-items-center ">
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
