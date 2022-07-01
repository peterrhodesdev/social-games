import React, { useEffect, useState } from "react";
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
  const [socket, setSocket] = useState(null);
  const [gameStage, setGameStage] = useState(GameStage.CONNECTING);
  const [gameData, setGameData] = useState(null);
  const [creator, setCreator] = useState(null);
  const [players, setPlayers] = useState([]);

  function updatePlayerList(updatedCreator, updatedPlayers) {
    setCreator(updatedCreator);
    setPlayers(updatedPlayers);

    switch (true) {
      // creator left before game could start
      case [GameStage.WAITING_FOR_PLAYERS, GameStage.READY_TO_START].includes(
        gameStage
      ) && !updatedPlayers.some((np) => np.id === updatedCreator.id):
        setGameStage(GameStage.ABANDONED);
        break;
      // have enough players to start
      case gameStage === GameStage.WAITING_FOR_PLAYERS &&
        updatedPlayers.length > 1:
        setGameStage(GameStage.READY_TO_START);
        break;
      // players left and don't have enough to start
      case gameStage === GameStage.READY_TO_START && updatedPlayers.length <= 1:
        setGameStage(GameStage.WAITING_FOR_PLAYERS);
        break;
      default:
        Logger.debug("no change to game stage");
    }
  }

  useEffect(() => {
    const gameSocket = getSocket(`game/${gameName}`, false);
    setSocket(gameSocket);

    gameSocket.on("create-room-success", () => {
      Logger.info("create room success");
      setGameStage(GameStage.WAITING_FOR_PLAYERS);
    });

    gameSocket.on("create-room-fail", () => {
      Logger.warn("create room fail");
      setGameStage(GameStage.ERROR);
    });

    gameSocket.on("join-room-success", () => {
      Logger.info("join room success");
      setGameStage(GameStage.WAITING_FOR_PLAYERS);
    });

    gameSocket.on("join-room-fail", () => {
      Logger.warn("join room fail");
      setGameStage(GameStage.ERROR);
    });

    // Server indicating to all players that the game is about to start
    gameSocket.on("generate-game-data-in-progress", () => {
      Logger.info("game about to start");
      setGameStage(GameStage.GENERATING_GAME);
    });

    // Received game data from the server
    gameSocket.on("generate-game-data-success", (gd) => {
      Logger.info("game data received from server", gd);
      setGameData(gd);
      setGameStage(GameStage.IN_PROGRESS);
    });

    gameSocket.on("generate-game-data-fail", () => {
      Logger.warn("failed to generate game data");
      setGameStage(GameStage.ERROR);
    });

    if (isCreator) {
      gameSocket.emit("create-room", gameId, playerId);
    } else {
      gameSocket.emit("join-room", gameId, playerId);
    }

    return () => gameSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      // Received list of players
      socket.on("player-list", (updatedCreator, updatedPlayers) => {
        Logger.info("player list received", updatedCreator, updatedPlayers);
        updatePlayerList(updatedCreator, updatedPlayers);
      });
    }
  }, [gameStage]);

  function startGame() {
    socket.emit("generate-game-data", gameId);
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
        <MathGrid gameData={gameData} socket={socket} gameId={gameId} />
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
