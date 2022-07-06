import React from "react";

function Square({ letter, isCentre }) {
  return (
    <div
      className={`aspect-square w-full ${
        isCentre ? " bg-black " : " bg-white "
      } flex items-center justify-center border border-black`}
    >
      <svg viewBox="0 0 20 20">
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: isCentre ? "white" : "black" }}
        >
          {letter.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

export { Square };
