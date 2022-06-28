import React, { useState } from "react";
import { Logger } from "shared";
import { GameArea } from "./GameArea";
import { GameControls } from "./GameControls";

function MathGrid({ gameData, socket, gameId }) {
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [activeAnswerSquare, setActiveAnswerSquare] = useState({
    row: 0,
    col: 0,
  });
  const [gameState, setGameState] = useState(
    [0, 1, 2].flatMap((row) =>
      [0, 1, 2].map((col) => ({ row, col, value: null, notesValues: [] }))
    )
  );

  // Multiplayer
  if (socket) {
    socket.on("game-state", (multiplayerGameState) => {
      Logger.info("game state changed");
      setGameState(multiplayerGameState);
    });
  }

  const handleGameAreaAnswerSquareClick = (row, col) => {
    Logger.debug(`answer square clicked: row = ${row}, col = ${col}`);
    setActiveAnswerSquare({ row, col });
  };

  const handleGameControlNumberClick = (value) => {
    Logger.debug(`number clicked: value = ${value}`);
    const newGameState = gameState.map((element) => {
      if (
        element.row === activeAnswerSquare.row &&
        element.col === activeAnswerSquare.col
      ) {
        let notesValues = [];
        if (isNotesMode) {
          notesValues = element.notesValues.includes(value)
            ? element.notesValues.filter((nv) => nv !== value)
            : [...element.notesValues, value];
        }
        return {
          row: element.row,
          col: element.col,
          value: isNotesMode || value === element.value ? null : value,
          notesValues,
        };
      }
      return element;
    });
    setGameState(newGameState);

    // Multiplayer
    if (socket) {
      socket.emit("game-state", gameId, newGameState);
    }
  };

  const handleGameControlNotesClick = () => {
    Logger.debug("notes clicked");
    setIsNotesMode((prevState) => !prevState);
  };

  function getActiveGameControlValues() {
    const activeAnswerSquareState = gameState.find(
      (element) =>
        element.row === activeAnswerSquare.row &&
        element.col === activeAnswerSquare.col
    );
    if (activeAnswerSquareState.value) {
      return [activeAnswerSquareState.value];
    }
    return activeAnswerSquareState.notesValues;
  }

  return (
    <div className="flex justify-center select-none">
      <div className="math-grid-container">
        <div className="pb-4">
          <GameArea
            game={gameData}
            answerSquareClickHandler={handleGameAreaAnswerSquareClick}
            activeAnswerSquare={activeAnswerSquare}
            gameState={gameState}
          />
        </div>
        <GameControls
          activeValues={getActiveGameControlValues()}
          numberClickHandler={handleGameControlNumberClick}
          notesClickHandler={handleGameControlNotesClick}
          isNotesMode={isNotesMode}
        />
      </div>
    </div>
  );
}

export { MathGrid };
