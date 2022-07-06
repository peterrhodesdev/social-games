import React, { useEffect, useState } from "react";
import { Logger } from "shared";
import { GameStage } from "./GameStage";
import { GameArea } from "./GameArea";
import { GameControls } from "./GameControls";
import { Spinner } from "../../partials/Spinner";

function countCharOccurrences(char, str) {
  return (str.match(new RegExp(char, "g")) || []).length;
}

function NineLetterWord({ gameData, socket, gameId }) {
  const [gameStage, setGameStage] = useState(GameStage.IN_PROGRESS);
  const [gameState, setGameState] = useState({ correct: [], incorrect: [] });
  const [answer, setAnswer] = useState(null);
  const [message, setMessage] = useState(null);

  function createMessage(word, reason, isCorrect) {
    return { text: `"${word}": ${reason}`, isCorrect };
  }

  useEffect(() => {
    socket.on("word-correct", (word) => {
      if (gameStage === GameStage.IN_PROGRESS) {
        Logger.info(`word correct ${word}`);
        setGameState((prevState) => ({
          correct: [...prevState.correct, word],
          incorrect: prevState.incorrect,
        }));
        setMessage(createMessage(word, "is correct", true));
      }
    });

    socket.on("word-incorrect", (word) => {
      if (gameStage === GameStage.IN_PROGRESS) {
        Logger.info(`word incorrect ${word}`);
        setGameState((prevState) => ({
          correct: prevState.correct,
          incorrect: [...prevState.incorrect, word],
        }));
        setMessage(createMessage(word, "is incorrect", false));
      }
    });

    socket.on("game-answer", (gameAnswer) => {
      setAnswer(gameAnswer);
      setGameStage(GameStage.FINISHED);
      setMessage(null);
    });
  }, []);

  function checkWord(word) {
    if (
      gameState.correct.includes(word) ||
      gameState.incorrect.includes(word)
    ) {
      setMessage(createMessage(word, "already entered", false));
      return false;
    }

    if (word.length < 3 || word.length > 9) {
      setMessage(createMessage(word, "must have 3-9 letters", false));
      return false;
    }

    if (!word.includes(gameData.centralLetter)) {
      setMessage(
        createMessage(
          word,
          `must include the letter '${gameData.centralLetter}'`,
          false
        )
      );
      return false;
    }

    if (
      ![...word].every(
        (letter) =>
          countCharOccurrences(letter, gameData.nineLetterWordShuffled) >=
          countCharOccurrences(letter, word)
      )
    ) {
      setMessage(
        createMessage(word, "can only use the given letters once", false)
      );
      return false;
    }

    return true;
  }

  const handleWordEnter = (word) => {
    Logger.debug(`word entered: ${word}`);
    if (checkWord(word)) {
      socket.emit("word-entered", gameId, word);
    }
  };

  function onSubmitClick() {
    Logger.debug("submit clicked");
    setGameStage(GameStage.SUBMITTED);
    socket.emit("game-finished", gameId);
  }

  let bottomPanel;
  switch (gameStage) {
    case GameStage.IN_PROGRESS:
      bottomPanel = (
        <>
          {message ? (
            <p
              className={message.isCorrect ? "text-green-500" : "text-red-500"}
            >
              {message.text}
            </p>
          ) : (
            <p>&nbsp;</p>
          )}
          <button type="button" onClick={() => onSubmitClick()}>
            Submit
          </button>
          <div className="grid grid-cols-2">
            <div>
              <p>Correct:</p>
              <ol className="text-green-500" reversed>
                {[...gameState.correct].reverse().map((word) => (
                  <li key={`correct-${word}`}>{word}</li>
                ))}
              </ol>
            </div>
            <div>
              <p>Incorrect:</p>
              <ol className="text-red-500" reversed>
                {[...gameState.incorrect].reverse().map((word) => (
                  <li key={`incorrect-${word}`}>{word}</li>
                ))}
              </ol>
            </div>
          </div>
        </>
      );
      break;
    case GameStage.SUBMITTED:
      bottomPanel = <Spinner />;
      break;
    case GameStage.FINISHED:
      bottomPanel = (
        <>
          <p>
            Found <strong>{gameState.correct.length}</strong> out of{" "}
            <strong>{answer.list.length}</strong> words (
            <strong>{gameState.incorrect.length}</strong> incorrect guess
            {gameState.incorrect.length === 1 ? "" : "es"}).
          </p>
          <p>
            The nine letter word is: <strong>{answer.nineLetterWord}</strong>
          </p>
          <div className="flex flex-row flex-wrap">
            {answer.list.map((word) => (
              <div
                key={`answer-${word}`}
                className={`p-1 mr-1 mb-1 rounded-lg border space-y-1 ${
                  gameState.correct.includes(word)
                    ? " border-green-500 text-green-500"
                    : " border-red-500 text-red-500 "
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </>
      );
      break;
    default:
      throw new Error(`unknown game stage: ${gameStage}`);
  }

  return (
    <div disabled={gameStage !== GameStage.IN_PROGRESS}>
      <div className="mb-12">
        <GameArea game={gameData} />
      </div>
      <div className="mb-4">
        <GameControls wordSubmitHandler={handleWordEnter} />
      </div>
      {bottomPanel}
    </div>
  );
}

export { NineLetterWord };
