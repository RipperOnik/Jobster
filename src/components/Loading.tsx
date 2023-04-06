import React from "react";

interface LoadingProps {
  center?: boolean;
}

export default function Loading({ center }: LoadingProps) {
  return <div className={center ? "loading loading-center" : "loading"} />;
}
