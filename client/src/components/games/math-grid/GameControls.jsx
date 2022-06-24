import React from "react";
import { PencilAltIcon } from "@heroicons/react/outline";

const COMMON_CSS =
  "aspect-square flex w-full rounded-lg border border-gray-300 active:ring-4 active:ring-gray-200";

function GameControls({
  numberClickHandler,
  notesClickHandler,
  isNotesMode,
  activeValues,
}) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: 9 }, (_, i) => i + 1).map((value) => (
        <button
          key={value}
          type="button"
          className={`math-grid-square ${COMMON_CSS} ${
            activeValues.includes(value)
              ? " bg-blue-500 hover:bg-blue-600 "
              : " hover:bg-gray-100 "
          }`}
          onClick={() => numberClickHandler(value)}
        >
          <svg viewBox="0 0 40 40">
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fill: activeValues.includes(value) ? "white" : "black" }}
            >
              {value}
            </text>
          </svg>
        </button>
      ))}
      <button
        type="button"
        className={`${COMMON_CSS} active:bg-yellow-300 ${
          isNotesMode
            ? " bg-yellow-300 hover:bg-yellow-400 "
            : " hover:bg-gray-100 "
        }`}
        onClick={() => notesClickHandler()}
      >
        <PencilAltIcon />
      </button>
    </div>
  );
}

export { GameControls };
