import React, { useEffect, useState } from "react";
import { Logger } from "shared";
import { getSocket } from "../../services/SocketService";
import { MathGrid } from "./math-grid/MathGrid";

function MultiPlayer({ gameId, gameName, isCreator, gameData }) {
  const [socket, setSocket] = useState(null);
  const [isWaitingForPartner, setIsWaitingForPartner] = useState(isCreator);
  const [gameStarted, setGameStarted] = useState(false);

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
      setIsWaitingForPartner(false);
    });

    // Server indicating to all players that the game has started
    socket.on("start", () => {
      Logger.info("game started");
      setGameStarted(true);
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

  let content;
  if (isWaitingForPartner) {
    content = <p>Waiting for partner...</p>;
  } else if (!gameStarted) {
    content = isCreator ? (
      <button type="button" onClick={() => startGame()}>
        Start
      </button>
    ) : (
      <p>Waiting for creator to start game</p>
    );
  } else {
    content = <MathGrid gameData={gameData} socket={socket} gameId={gameId} />;
  }

  return content;
}

export { MultiPlayer };
