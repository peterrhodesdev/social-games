import React from "react";

function BlankSquare({ isOnEdge }) {
  return (
    <div
      className={`aspect-square w-full ${
        isOnEdge ? "bg-white" : "bg-black"
      } flex items-center justify-center`}
    />
  );
}

export { BlankSquare };
