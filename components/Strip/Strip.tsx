import React from "react";

interface Props {
  src: string;
}

const Strip = ({ src }: Props) => {
  return (
    <div className="flex flex-col items-center">
      <img src={src} alt="" className="p-10 " />
      <a href={src} download="vid2strip">
        Download
      </a>
    </div>
  );
};

export default Strip;
