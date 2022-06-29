import React, { useEffect, useState } from "react";
import { Logger } from "shared";
import { getSocket } from "../../services/SocketService";
import { MathGrid } from "./math-grid/MathGrid";

const GameStage = Object.freeze({
  WAITING_FOR_PARTNER: Symbol("waitingForPartner"),
  GENERATING_GAME: Symbol("generatingGame"),
  READY: Symbol("ready"),
  STARTED: Symbol("started"),
});

function MultiPlayer({ gameId, gameName, isCreator }) {
  const [socket, setSocket] = useState(null);
  const [gameStage, setGameStage] = useState(
    isCreator ? GameStage.WAITING_FOR_PARTNER : GameStage.GENERATING_GAME
  );
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    setSocket(getSocket(`game/${gameName}`));
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Another user has joined the game
    socket.on("partner-join", (partnerId) => {
      Logger.info(`partner ${partnerId} joined`);
      setGameStage(GameStage.GENERATING_GAME);
    });

    // Received game data from the server
    socket.on("game-data", (gd) => {
      Logger.info("game data received from server", gd);
      setGameData(gd);
      setGameStage(GameStage.READY);
    });

    // Server indicating to all players that the game has started
    socket.on("start", () => {
      Logger.info("game started");
      setGameStage(GameStage.STARTED);
    });

    if (!isCreator) {
      socket.emit("join-room", gameId);
    } else {
      socket.emit("create-room", gameId);
    }
  }, [socket]);

  function startGame() {
    socket.emit("start", gameId);
  }

  switch (gameStage) {
    case GameStage.WAITING_FOR_PARTNER:
      return <p>Waiting for partner...</p>;
    case GameStage.GENERATING_GAME:
      return <p>All players joined, generating game...</p>;
    case GameStage.READY:
      return isCreator ? (
        <button type="button" onClick={() => startGame()}>
          Start
        </button>
      ) : (
        <p>Game generated, waiting for creator to start game...</p>
      );
    case GameStage.STARTED:
      return <MathGrid gameData={gameData} socket={socket} gameId={gameId} />;
    default:
      throw new Error(`Unknown game stage: ${gameStage}`);
  }
}

export { MultiPlayer };
