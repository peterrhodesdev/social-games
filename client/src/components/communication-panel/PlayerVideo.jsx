/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from "react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Spinner } from "../partials/Spinner";

function PlayerVideo({ playerName, isConnecting, unavailable, stream }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef || !stream) return;
    videoRef.current.srcObject = stream;
  }, [videoRef, stream]);

  let videoElement;
  switch (true) {
    case isConnecting:
      videoElement = <Spinner />;
      break;
    case unavailable:
      videoElement = (
        <ExclamationIcon className="block w-full" aria-hidden="true" />
      );
      break;
    default:
      videoElement = (
        <video className="my-0" playsInline ref={videoRef} autoPlay />
      );
  }

  return (
    <div className="p-2">
      {videoElement}
      <div className="text-center">{playerName}</div>
    </div>
  );
}

export { PlayerVideo };
