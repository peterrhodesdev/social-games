import React, { useEffect, useRef, useState } from "react";
import { Logger } from "shared";
import { getSocket } from "../../services/SocketService";
import { CommunicationPanel } from "./CommunicationPanel";
import { MathGrid } from "./math-grid/MathGrid";

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

function MultiPlayer({ gameId, gameName, isCreator, playerId }) {
  const socketRef = useRef(null);
  const [gameStage, setGameStage] = useState(GameStage.CONNECTING);
  const [gameData, setGameData] = useState(null);
  const [creator, setCreator] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socketRef.current = getSocket(`game/${gameName}`, false);

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
      socketRef.current.emit("create-room", gameId, playerId);
    } else {
      socketRef.current.emit("join-room", gameId, playerId);
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

  function startGame() {
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
        <button type="button" onClick={() => startGame()}>
          Start
        </button>
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
        <MathGrid
          gameData={gameData}
          socket={socketRef.current}
          gameId={gameId}
        />
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
    <div className="grid grid-cols-2">
      <div>{gamePanel}</div>
      <div>
        <CommunicationPanel
          creator={creator}
          players={players}
          myPlayerId={playerId}
        />
      </div>
    </div>
  );
}

export { MultiPlayer };
