import React from "react";
import { CircleProgress } from "tiu-ui";

interface Props {
  label: string;
  progress: number;
}

const Progress = ({ label, progress }: Props) => {
  return (
    <div className="grid w-12 sm:w-28 justify-items-center">
      <CircleProgress progress={progress} completedProgressBarColor="#91db8f" />
      <p>{label}</p>
    </div>
  );
};

export default Progress;
