import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Logger } from "shared";
import { createSocket } from "../../services/SocketService";
import { Button } from "../partials/Button";
import { CommunicationPanel } from "../communication-panel/CommunicationPanel";
import { MathGrid } from "./math-grid/MathGrid";
import { NineLetterWord } from "./nine-letter-word/NineLetterWord";
import { usePlayer } from "../../contexts/UserContext";

const gameDetails = {
  "math-grid": {
    displayName: "Math Grid",
    component: (props) => <MathGrid {...props} />,
  },
  "nine-letter-word": {
    displayName: "Nine Letter Word",
    component: (props) => <NineLetterWord {...props} />,
  },
};

const GameStage = Object.freeze({
  CONNECTING: "CONNECTING",
  WAITING_FOR_PLAYERS: "WAITING_FOR_PLAYERS",
  READY_TO_START: "READY_TO_START",
  GENERATING_GAME: "GENERATING_GAME",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  ABANDONED: "ABANDONED",
  ERROR: "ERROR",
});

function Game() {
  const location = useLocation();
  if (!location || !location.state) {
    // When user navigates directly to URL without joining a game
    Logger.debug("location state is empty");
    return <Navigate to="/" />;
  }

  const { player } = usePlayer();
  const { gameId, gameName, isCreator } = location.state;
  Logger.debug(
    `Game: game ID = ${gameId}, name = ${gameName}, isCreator = ${isCreator}`
  );

  const socketRef = useRef(null);
  const [gameStage, setGameStage] = useState(GameStage.CONNECTING);
  const [gameData, setGameData] = useState(null);
  const [creator, setCreator] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socketRef.current = createSocket(`game/${gameName}`);

    socketRef.current.on("create-room-success", () => {
      Logger.info("create room success");
      setGameStage(GameStage.WAITING_FOR_PLAYERS);
    });

    socketRef.current.on("create-room-fail", () => {
      Logger.warn("create room fail");
      setGameStage(GameStage.ERROR);
    });

    socketRef.current.on("join-room-success", () => {
      Logger.info("join room success");
      setGameStage(GameStage.READY_TO_START);
    });

    socketRef.current.on("join-room-fail", () => {
      Logger.warn("join room fail");
      setGameStage(GameStage.ERROR);
    });

    // Server indicating to all players that the game is about to start
    socketRef.current.on("generate-game-data-in-progress", () => {
      Logger.info("game about to start");
      setGameStage(GameStage.GENERATING_GAME);
    });

    // Received game data from the server
    socketRef.current.on("generate-game-data-success", (gd) => {
      Logger.info("game data received from server", gd);
      setGameData(gd);
      setGameStage(GameStage.IN_PROGRESS);
    });

    socketRef.current.on("generate-game-data-fail", () => {
      Logger.warn("failed to generate game data");
      setGameStage(GameStage.ERROR);
    });

    if (isCreator) {
      socketRef.current.emit("create-room", gameId, player.id);
    } else {
      socketRef.current.emit("join-room", gameId, player.id);
    }

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    const updatePlayerList = (updatedCreator, updatedPlayers) => {
      Logger.info("player list received", updatedCreator, updatedPlayers);
      setCreator(updatedCreator);
      setPlayers(updatedPlayers);

      // Shortcircuit game stage checks/changes if game already started
      if (
        ![GameStage.WAITING_FOR_PLAYERS, GameStage.READY_TO_START].includes(
          gameStage
        )
      ) {
        return;
      }

      switch (true) {
        // creator left before game could start
        case !updatedPlayers.some((np) => np.id === updatedCreator.id):
          setGameStage(GameStage.ABANDONED);
          break;
        // have enough players to start
        case gameStage === GameStage.WAITING_FOR_PLAYERS &&
          updatedPlayers.length > 1:
          setGameStage(GameStage.READY_TO_START);
          break;
        // players left and don't have enough to start
        case gameStage === GameStage.READY_TO_START &&
          updatedPlayers.length <= 1:
          setGameStage(GameStage.WAITING_FOR_PLAYERS);
          break;
        default:
          Logger.debug("no change to game stage");
      }
    };

    // Received list of players
    socketRef.current.on("player-list", updatePlayerList);

    return () => socketRef.current.off("player-list", updatePlayerList);
  }, [gameStage]);

  function onStartClick() {
    socketRef.current.emit("generate-game-data", gameId);
  }

  let gamePanel;
  switch (gameStage) {
    case GameStage.CONNECTING:
      gamePanel = <p>Connecting...</p>;
      break;
    case GameStage.WAITING_FOR_PLAYERS:
      gamePanel = <p>Waiting for players...</p>;
      break;
    case GameStage.READY_TO_START:
      gamePanel = isCreator ? (
        <Button text="Start" onClickHandler={() => onStartClick()} />
      ) : (
        <p>Waiting for creator to start game...</p>
      );
      break;
    case GameStage.GENERATING_GAME:
      gamePanel = <p>Generating game...</p>;
      break;
    case GameStage.IN_PROGRESS:
    case GameStage.COMPLETED:
      gamePanel = (
        <div className="flex justify-center select-none">
          <div className="game-container">
            {gameDetails[gameName].component({
              gameData,
              socket: socketRef.current,
              gameId,
            })}
          </div>
        </div>
      );
      break;
    case GameStage.ABANDONED:
      gamePanel = <p>Game abandoned</p>;
      break;
    case GameStage.ERROR:
      gamePanel = <p>Error</p>;
      break;
    default:
      throw new Error(`Unknown game stage: ${gameStage}`);
  }

  return (
    <>
      <h1>{gameDetails[gameName].displayName}</h1>
      <div className="flex flex-row">
        <div className="w-1/2 min-w-[320px] mx-1">{gamePanel}</div>
        <div className="sticky top-2 w-1/2 min-w-[320px] h-fit px-2 py-2 rounded-sm bg-gray-50 border border-gray-100">
          {socketRef.current ? (
            <CommunicationPanel
              creator={creator}
              players={players}
              socket={socketRef.current}
              gameId={gameId}
            />
          ) : (
            <p>Connecting...</p>
          )}
        </div>
      </div>
    </>
  );
}

export { Game };
