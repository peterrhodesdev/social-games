import React from "react";

function BlankSquare({ isOnEdge, backgroundColor }) {
  return (
    <div
      className={`aspect-square w-full ${
        isOnEdge ? backgroundColor : "bg-black"
      } flex items-center justify-center`}
    />
  );
}

export { BlankSquare };
