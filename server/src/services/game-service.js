import { Logger } from "shared";
import { v4 as uuidv4 } from "uuid";
import { generate as generateMathGrid } from "../games/math-grid.js";

let games = [];

function generateGameData(gameName) {
  let gameData;
  switch (gameName) {
    case "math-grid":
      gameData = generateMathGrid();
      break;
    default:
      Logger.error(`Unknown game name: ${gameName}`);
      throw new Error(`Unknown game name: ${gameName}`);
  }
  return gameData;
}

function createNewGame(creator, gameName) {
  const id = uuidv4();
  const gameData = generateGameData(gameName);
  const game = { gameId: id, creator, gameName, gameData };
  games.push(game);
  return game;
}

function getGameList() {
  // Delete the gameData attribute from each element
  return games.map(({ gameData, ...otherAttrs }) => otherAttrs);
}

function getGame(gameId) {
  return games.find((game) => game.gameId === gameId);
}

function removeGameFromList(gameId) {
  games = games.filter((game) => game.gameId !== gameId);
}

export { createNewGame, getGame, getGameList, removeGameFromList };
