import React from "react";
import { Logger } from "shared";

function NineLetterWord({ gameData, socket, gameId }) {
  Logger.debug("game data", gameData, "socket", socket.id, "game", gameId);
  return <p>nine letter word</p>;
}

export { NineLetterWord };
