import React, { useState } from "react";
import { Logger } from "shared";
import { GameArea } from "./GameArea";
import { GameControls } from "./GameControls";
import { GameStage } from "./GameStage";

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
  const [gameStage, setGameStage] = useState(GameStage.IN_PROGRESS);

  function isGameActive() {
    return [GameStage.IN_PROGRESS, GameStage.ANSWER_INCORRECT].includes(
      gameStage
    );
  }

  // Multiplayer
  if (socket) {
    socket.on("game-state", (multiplayerGameState) => {
      if (isGameActive()) {
        Logger.info("game state changed");
        setGameState(multiplayerGameState);
        if (gameStage === GameStage.ANSWER_INCORRECT) {
          setGameStage(GameStage.IN_PROGRESS);
        }
      } else {
        Logger.debug("game inactive, ignoring state change");
      }
    });

    socket.on("answer-checked", (isCorrect) => {
      setGameStage(
        isCorrect ? GameStage.ANSWER_CORRECT : GameStage.ANSWER_INCORRECT
      );
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

    if (gameStage === GameStage.ANSWER_INCORRECT) {
      setGameStage(GameStage.IN_PROGRESS);
    }

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

  function getCurrentAnswer() {
    const answer = [];
    for (let i = 0; i < 3; i += 1) {
      answer[i] = [];
      for (let j = 0; j < 3; j += 1) {
        answer[i][j] = gameState.find(
          (element) => element.row === i && element.col === j
        ).value;
      }
    }
    return answer;
  }

  function canAnswerBeSubmitted() {
    return getCurrentAnswer()
      .flatMap((element) => element)
      .every((element) => element);
  }

  function onSubmitClick() {
    setGameStage(GameStage.CHECKING_ANSWER);
    socket.emit("check-answer", gameId, getCurrentAnswer());
  }

  return (
    <div className="flex justify-center select-none" disabled={!isGameActive()}>
      <div className="math-grid-container">
        <div className="pb-4">
          <GameArea
            game={gameData}
            answerSquareClickHandler={handleGameAreaAnswerSquareClick}
            activeAnswerSquare={activeAnswerSquare}
            gameState={gameState}
            gameStage={gameStage}
          />
        </div>
        <GameControls
          activeValues={getActiveGameControlValues()}
          numberClickHandler={handleGameControlNumberClick}
          notesClickHandler={handleGameControlNotesClick}
          isNotesMode={isNotesMode}
        />
        <div>
          <button
            type="button"
            onClick={() => onSubmitClick()}
            disabled={!(canAnswerBeSubmitted() && isGameActive())}
          >
            Submit
          </button>
          {gameStage === GameStage.ANSWER_CORRECT && <p>Correct</p>}
          {gameStage === GameStage.ANSWER_INCORRECT && <p>Incorrect</p>}
        </div>
      </div>
    </div>
  );
}

export { MathGrid };
