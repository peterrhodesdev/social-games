import React from "react";
import { MathGrid } from "../components/games/math-grid/MathGrid";

function getGame(gameName, includeComponent = false, props = {}) {
  let game;
  switch (gameName) {
    case "math-grid":
      game = { displayName: "Math Grid" };
      if (includeComponent) {
        game.component = <MathGrid {...props} />;
      }
      break;
    default:
      throw new Error();
  }
  return game;
}

function getGameDetails(gameName) {
  return getGame(gameName);
}

function getGameComponent(gameName, props = {}) {
  return getGame(gameName, true, props).component;
}

export { getGame, getGameComponent, getGameDetails };
