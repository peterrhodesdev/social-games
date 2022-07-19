import React from "react";
import { useParams } from "react-router-dom";
import { getGameByName } from "../../GameList";
import { Controls } from "./Controls";
import { Images } from "./Images";
import { Rules } from "./Rules";

function Guide() {
  const { gameName } = useParams();
  const game = getGameByName(gameName);
  return (
    <>
      <h1>Guide: {game.displayName}</h1>
      <div className="grid grid-cols-2">
        <div>
          <Images game={game} />
        </div>
        <div>
          <p>{game.description}</p>
          <h2>Rules</h2>
          <Rules game={game} />
          <h2>Controls</h2>
          <Controls game={game} />
        </div>
      </div>
    </>
  );
}

export { Guide };
