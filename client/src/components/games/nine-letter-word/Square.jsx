import React from "react";

function Square({ letter, isCentre, letterClickHandler }) {
  const upperCaseLetter = letter.toUpperCase();

  return (
    <button
      type="button"
      className={`aspect-square w-full ${
        isCentre ? " bg-black " : " bg-white "
      } flex items-center justify-center border border-black cursor-pointer`}
      onClick={() => letterClickHandler(upperCaseLetter)}
    >
      <svg viewBox="0 0 20 20">
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: isCentre ? "white" : "black" }}
        >
          {upperCaseLetter}
        </text>
      </svg>
    </button>
  );
}

export { Square };
