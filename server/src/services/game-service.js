import { Logger } from "shared";
import { v4 as uuidv4 } from "uuid";
import {
  generate as generateMathGrid,
  checkAnswer as checkAnswerMathGrid,
} from "../games/math-grid.js";
import {
  getPlayer,
  getPlayerPublicInfo,
  playerCreatedGame,
  playerRequestedToJoinGame,
  PlayerStatus,
} from "./player-service.js";

let games = [];

const GameStatus = Object.freeze({
  CREATED: "CREATED",
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  DELETED: "DELETED",
});

/**
 * Creates a new game
 * @param {string} playerId ID of the player creating the game
 * @param {string} gameName name of the game
 * @returns {Game} new game
 * @throws if the player is not found
 * @throws if the player is involved in another game
 */
function createNewGame(playerId, gameName) {
  const player = getPlayer(playerId);
  if (player.currentGameId) {
    Logger.logAndThrowError(
      `player ${player.id} is already involved in game ${player.currentGameId}`
    );
  }

  const gameId = uuidv4();
  const game = {
    id: gameId,
    creatorId: playerId,
    name: gameName,
    status: GameStatus.CREATED,
    playerIds: [],
  };
  games.push(game);
  Logger.info("created game", game);

  playerCreatedGame(player.id, gameId);

  return game;
}

/**
 * Gets a game
 * @param {string} gaemId ID of the game
 * @returns {Game} game
 * @throws if the game is not found
 */
function getGame(gameId) {
  const game = games.find((g) => g.id === gameId);
  if (!game) {
    Logger.logAndThrowError(`game ${gameId} not found`);
  }
  return game;
}

function getGamePublicInfo(gameId) {
  const game = getGame(gameId);
  return {
    id: game.id,
    creator: getPlayerPublicInfo(game.creatorId),
    name: game.name,
    status: game.status,
    players: game.playerIds.map((pId) => getPlayerPublicInfo(pId)),
  };
}

/**
 * Gets all games
 * @returns {Array} games
 */
function getGames() {
  return games;
}

// private
function updateGame(gameId, partialGame) {
  games = games.map((game) =>
    game.id === gameId ? { ...game, ...partialGame } : game
  );
}

/**
 * Deletes open game created by player
 * @param {string} playerId player ID
 * @returns {string} game ID that player is involved with, null if none
 */
function deleteOpenGamesByPlayer(playerId) {
  const playerGame = games.find(
    (game) => game.creatorId === playerId && game.status === GameStatus.OPEN
  );

  if (!playerGame) {
    return null;
  }

  updateGame(playerGame.id, { status: GameStatus.DELETED });
  return playerGame.id;
}

function createRoom(gameId, playerId) {
  const game = getGame(gameId);
  const player = getPlayer(playerId);

  // check player is the creator
  if (game.creatorId !== player.id) {
    Logger.logAndThrowError(
      `game ${gameId} creator ${game.creatorId} is not player ${playerId}`
    );
  }

  // check game status is valid
  if (game.status !== GameStatus.CREATED) {
    Logger.logAndThrowError(`invalid game status: ${game.status}`);
  }

  // check player status is valid
  if (player.status !== PlayerStatus.CREATED_GAME) {
    Logger.logAndThrowError(`invalid player status: ${player.status}`);
  }

  updateGame(gameId, {
    status: GameStatus.OPEN,
    playerIds: [...game.playerIds, playerId],
  });
}

function joinGameRequest(gameId, playerId) {
  const player = getPlayer(playerId);

  // check player not already in game
  if (player.currentGameId) {
    Logger.logAndThrowError(
      `player ${playerId} is already in game ${player.currentGameId}`
    );
  }

  // check player status is valid
  if (player.status !== PlayerStatus.CONNECTED) {
    Logger.logAndThrowError(`invalid player status ${player.status}`);
  }

  const game = getGame(gameId);
  if (game.status !== GameStatus.OPEN) {
    Logger.logAndThrowError(`game ${gameId} isn't open: ${game.status}`);
  }

  playerRequestedToJoinGame(player.id, gameId);
}

function joinRoom(gameId, playerId) {
  const player = getPlayer(playerId);

  if (player.status !== PlayerStatus.REQUESTED_TO_JOIN) {
    Logger.logAndThrowError(`player status not requested: ${player.status}`);
  }

  if (player.currentGameId !== gameId) {
    Logger.logAndThrowError(
      `player's game ID ${player.currentGameId} doesn't match`
    );
  }

  const game = getGame(gameId);
  if (game.status !== GameStatus.OPEN) {
    Logger.logAndThrowError(`game ${gameId} isn't open: ${game.status}`);
  }

  updateGame(gameId, { playerIds: [...game.playerIds, playerId] });
}

function deletePlayerFromGames(gameSocketId) {
  let playerId = null;
  const game = games.find((g) =>
    g.playerIds.some((pId) => {
      const player = getPlayer(pId);
      if (player.gameSocketId === gameSocketId) {
        playerId = pId;
        return true;
      }
      return false;
    })
  );

  if (game && playerId) {
    updateGame(game.id, {
      playerIds: game.playerIds.filter((pId) => pId !== playerId),
    });
    return game.id;
  }

  return null;
}

function generateGameDataAndAnswer(gameName) {
  switch (gameName) {
    case "math-grid":
      return generateMathGrid();
    default:
      throw new Error(`Unknown game name: ${gameName}`);
  }
}

function generateGameData(gameId) {
  const game = getGame(gameId);

  if (game.status !== GameStatus.OPEN) {
    Logger.logAndThrowError(`invalid game status: ${game.status}`);
  }

  const { answer, ...gameData } = generateGameDataAndAnswer(game.name);
  updateGame(gameId, {
    ...game,
    status: GameStatus.IN_PROGRESS,
    answer,
    data: gameData,
  });
  return gameData;
}

///////////////////////////





// TODO getPlayer(gameId, playerId)

function checkGameAnswer(gameId, answer) {
  const game = getGame(gameId, true);
  if (!game) {
    Logger.error(`couldn't find game ${gameId}`);
    throw new Error(`couldn't find game ${gameId}`);
  }
  // TODO select function based on game name
  return checkAnswerMathGrid(game.answer, answer);
}

/* function checkPlayerNotInvolvedInAnyGames(playerId) {
  const game = games.find((g) => g.players.map((p) => p.id).includes(playerId));
  if (game) {
    throw new Error(
      `player ${playerId} is already part of game ${game.gameId}`
    );
  }
}

function updateGameStatus(gameId, newStatus) {
  games = games.map((game) =>
    game.gameId === gameId ? { ...game, status: newStatus } : game
  );
}

function playerRequestedToJoin(gameId, playerId) {
  checkPlayerNotInvolvedInAnyGames(playerId);

  const game = getGame(gameId);

  if (!game) {
    throw new Error(`couldn't find game ${gameId}`);
  }
  if (game.status !== GameStatus.OPEN) {
    throw new Error(`game ${gameId} isn't open: ${game.status}`);
  }

  //game.players.push(createPlayer(playerId, PlayerStatus.REQUESTED_TO_JOIN));
} */


export {
  createRoom,
  checkGameAnswer,
  createNewGame,
  deleteOpenGamesByPlayer,
  deletePlayerFromGames,
  generateGameData,
  getGame,
  getGamePublicInfo,
  getGames,
  joinGameRequest,
  joinRoom,
  GameStatus,
};
