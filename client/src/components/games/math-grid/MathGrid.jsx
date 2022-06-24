import React, { useEffect, useState } from "react";
import { Logger } from "shared";
import { getOne } from "../../../services/HttpService";
import { GameArea } from "./GameArea";
import { GameControls } from "./GameControls";

function MathGrid() {
  const [game, setGame] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
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

  useEffect(() => {
    const getNewGame = async () => {
      setStatusMessage("Loading");
      try {
        const response = await getOne(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/game`,
          "math-grid"
        );
        setGame(response.parsedBody);
        setStatusMessage(null);
      } catch (err) {
        setStatusMessage("Error");
      }
    };

    getNewGame();
  }, []);

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

  // flex justify-center select-none
  // w-4/5 min-w-[280px] max-w-2xl

  return (
    <>
      <h1>Math Grid</h1>
      {statusMessage && <p>{statusMessage}</p>}
      {game && (
        <div className="flex justify-center select-none">
          <div className="math-grid-container">
            <div className="pb-4">
              <GameArea
                game={game}
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
      )}
    </>
  );
}

export { MathGrid };
