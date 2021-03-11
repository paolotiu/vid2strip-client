import React from "react";
import Progress from "./Progress";

interface Props {
  upload: number;
  frames: number;
  color: number;
  isVisible: boolean;
  isYt: boolean;
}

export const ProcessProgress = ({
  upload,
  frames,
  color,
  isVisible,
  isYt,
}: Props) => {
  if (!isVisible) {
    return <> </>;
  }
  return (
    <div className="grid items-center w-full grid-flow-col gap-10 justify-items-center py-7">
      <Progress label={isYt ? "Download" : "Upload"} progress={upload} />
      <Progress label="Frames" progress={frames} />
      <Progress label="Colors" progress={color} />
    </div>
  );
};
