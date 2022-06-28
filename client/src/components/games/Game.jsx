import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Logger } from "shared";
import { getGameDetails } from "../../services/GameService";
import { MultiPlayer } from "./MultiPlayer";
import { SinglePlayer } from "./SinglePlayer";

function Game() {
  let gameName;
  let gameComponent;
  const location = useLocation();
  if (!location || !location.state) {
    // When user navigates directly to URL without joining a game
    Logger.debug("location state is empty");
    gameName = useParams().gameName;
    gameComponent = <SinglePlayer gameName={gameName} />;
  } else {
    Logger.debug("location state is not empty");
    gameName = location.state.gameName;
    gameComponent = <MultiPlayer {...location.state} />;
  }

  const gameDetails = getGameDetails(gameName);

  return (
    <>
      <h1>{gameDetails.displayName}</h1>
      {gameComponent}
    </>
  );
}

export { Game };
