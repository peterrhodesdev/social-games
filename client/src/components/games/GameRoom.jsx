import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Logger } from "shared";
import { getSocket } from "../../services/SocketService";
import { MathGrid } from "./math-grid/MathGrid";

function GameRoom() {
  const location = useLocation();
  const { id: gameId, gameName, isCreator, gameData } = location.state;

  const [isWaitingForPartner, setIsWaitingForPartner] = useState(isCreator);

  useEffect(() => {
    const socket = getSocket(`game/${gameName}`);

    socket.on("partner-join", (partnerId) => {
      setIsWaitingForPartner(false);
      Logger.info(`partner ${partnerId} joined`);
    });

    if (!isCreator) {
      socket.emit("join-room", gameId);
    } else {
      socket.emit("create-room", gameId);
    }
  }, []);

  return (
    <>
      <h1>Math Grid</h1>
      {isWaitingForPartner ? (
        <p>Waiting for partner...</p>
      ) : (
        <MathGrid gameData={gameData} />
      )}
    </>
  );
}

export { GameRoom };
