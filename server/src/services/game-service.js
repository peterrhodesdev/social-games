import { Logger } from "shared";
import { v4 as uuidv4 } from "uuid";
import {
  generate as generateMathGrid,
  checkAnswer as checkAnswerMathGrid,
} from "../games/math-grid.js";

const games = [];

const GameStatus = Object.freeze({
  OPEN: Symbol("open"),
  CLOSED: Symbol("closed"),
});

function closeGame(gameId) {
  games.map((game) =>
    game.gameId === gameId ? { ...game, status: GameStatus.CLOSED } : game
  );
}

function generateGameData(gameName) {
  switch (gameName) {
    case "math-grid":
      return generateMathGrid();
    default:
      Logger.error(`Unknown game name: ${gameName}`);
      throw new Error(`Unknown game name: ${gameName}`);
  }
}

function createNewGame(creator, gameName) {
  const gameId = uuidv4();
  const { answer, ...gameData } = generateGameData(gameName);
  const game = {
    gameId,
    creator,
    gameName,
    gameData,
    answer,
    status: GameStatus.OPEN,
  };
  games.push(game);
  return game;
}

function getOpenGameList() {
  return games
    .filter((game) => game.status === GameStatus.OPEN)
    .map((game) => ({
      gameId: game.gameId,
      creator: game.creator,
      gameName: game.gameName,
    }));
}

function getGame(gameId, includeAnswer = false) {
  const game = games.find((g) => g.gameId === gameId);
  if (game && !includeAnswer) {
    const { answer, ...otherAttrs } = game;
    return otherAttrs;
  }
  return game;
}

function checkGameAnswer(gameId, answer) {
  const game = getGame(gameId, true);
  if (!game) {
    Logger.error(`couldn't find game ${gameId}`);
    throw new Error(`couldn't find game ${gameId}`);
  }
  // TODO select function based on game name
  return checkAnswerMathGrid(game.answer, answer);
}

export { checkGameAnswer, closeGame, createNewGame, getGame, getOpenGameList };
