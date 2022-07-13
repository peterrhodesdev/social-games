import React from "react";
import { Square } from "./Square";

function GameArea({ game, letterClickHandler }) {
  const grid = [];
  for (let i = 0; i < 3; i += 1) {
    grid[i] = [];
    for (let j = 0; j < 3; j += 1) {
      grid[i][j] = (
        <Square
          letter={game.nineLetterWordShuffled[i * 3 + j]}
          isCentre={i === 1 && j === 1}
          letterClickHandler={letterClickHandler}
        />
      );
    }
  }
  return (
    <div className="w-[80%] mx-auto">
      <div className="flex flex-col aspect-square border border-black">
        {grid.map((row) => (
          <div className="flex flex-row">{row}</div>
        ))}
      </div>
    </div>
  );
}

export { GameArea };
