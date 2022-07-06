import React, { useEffect, useRef, useState } from "react";
import { Logger } from "shared";
import { GameArea } from "./GameArea";
import { GameControls } from "./GameControls";
import { GameStage } from "./GameStage";
import { mod } from "../../../utils/math-utils";

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
  const isKeyDown = useRef(false);

  function handleAnswerValueInput(value) {
    Logger.debug(`answer value input: ${value}`);
    const newGameState = gameState.map((element) => {
      if (
        activeAnswerSquare &&
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

    socket.emit("game-state", gameId, newGameState);
  }

  // Key events
  useEffect(() => {
    const isArrowKey = (keyCode) => keyCode >= 37 && keyCode <= 40;
    const isNumberKey = (keyCode) => keyCode >= 49 && keyCode <= 57;
    const isNumpadKey = (keyCode) => keyCode >= 97 && keyCode <= 105;
    const isValidKey = (keyCode) =>
      isArrowKey(keyCode) || isNumberKey(keyCode) || isNumpadKey(keyCode);

    function answerKeyAction(keyCode) {
      let rowOffset = 0;
      let colOffset = 0;
      switch (keyCode) {
        case 37: // arrow left
          colOffset = -1;
          break;
        case 38: // arrow up
          rowOffset = -1;
          break;
        case 39: // arrow right
          colOffset = 1;
          break;
        case 40: // arrow down
          rowOffset = 1;
          break;
        default:
          throw new Error(`invalid arrow key: ${keyCode}`);
      }
      setActiveAnswerSquare((prevState) => ({
        row: mod(prevState.row + rowOffset, 3),
        col: mod(prevState.col + colOffset, 3),
      }));
    }

    function handleKeyDown(e) {
      const { keyCode } = e;
      if (
        isKeyDown.current ||
        !isValidKey(keyCode) ||
        gameStage === GameStage.ANSWER_CORRECT
      ) {
        return;
      }
      isKeyDown.current = true;
      e.preventDefault();
      Logger.debug(`key down code: ${keyCode}`);

      switch (true) {
        case isNumberKey(keyCode):
          handleAnswerValueInput(keyCode - 48);
          break;
        case isNumpadKey(keyCode):
          handleAnswerValueInput(keyCode - 96);
          break;
        case isArrowKey(keyCode):
          answerKeyAction(keyCode);
          break;
        default:
          throw new Error(`invalid key code: ${keyCode}`);
      }
    }

    function handleKeyUp(e) {
      if (
        !isKeyDown.current ||
        !isValidKey(e.keyCode) ||
        gameStage === GameStage.ANSWER_CORRECT
      ) {
        return;
      }
      isKeyDown.current = false;
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isNotesMode, activeAnswerSquare, gameState, gameStage]);

  function isGameActive() {
    return [GameStage.IN_PROGRESS, GameStage.ANSWER_INCORRECT].includes(
      gameStage
    );
  }

  useEffect(() => {
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
      if (isCorrect) {
        setGameStage(GameStage.ANSWER_CORRECT);
        setActiveAnswerSquare(null);
      } else {
        setGameStage(GameStage.ANSWER_INCORRECT);
      }
    });
  }, []);

  const handleGameAreaAnswerSquareClick = (row, col) => {
    Logger.debug(`answer square clicked: row = ${row}, col = ${col}`);
    setActiveAnswerSquare({ row, col });
  };

  const handleGameControlNumberClick = (value) => {
    Logger.debug(`number clicked`);
    handleAnswerValueInput(value);
  };

  const handleGameControlNotesClick = () => {
    Logger.debug("notes clicked");
    setIsNotesMode((prevState) => !prevState);
  };

  function getActiveGameControlValues() {
    if (!activeAnswerSquare) {
      return [];
    }

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
