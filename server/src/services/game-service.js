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
  playerLeftGame,
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

/**
 * Gets a game's public info
 * @param {string} gameId game ID
 * @returns {Game} game public info
 * @throws if the game is not found
 */
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

/**
 * Performs checks to see if a room can be created then updates the game
 * @param {string} gameId game ID
 * @param {string} playerId player ID
 * @throws if player is not the creator
 * @throws if game status is invalid
 * @throws if player status is invalid
 */
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

/**
 * Marks a player as requested to join a game
 * @param {string} gameId game ID
 * @param {string} playerId player ID
 * @throws if player is already in a game
 * @throws if player status is invalid
 * @throws if game status is invalid
 */
function joinGameRequest(gameId, playerId) {
  const player = getPlayer(playerId);

  // check player not already in game
  if (player.currentGameId) {
    Logger.logAndThrowError(
      `player ${playerId} is already in game ${player.currentGameId}`,
      player
    );
  }

  // check player status is valid
  if (player.status !== PlayerStatus.CONNECTED) {
    Logger.logAndThrowError(`invalid player status ${player.status}`, player);
  }

  const game = getGame(gameId);
  if (game.status !== GameStatus.OPEN) {
    Logger.logAndThrowError(`game ${gameId} isn't open: ${game.status}`, game);
  }

  playerRequestedToJoinGame(player.id, gameId);
}

/**
 * Joins a player to a game room
 * @param {string} gameId game ID
 * @param {string} playerId player ID
 * @throws if player status is invalid
 * @throws if player is joined to another game
 * @throws if game status is invalid
 */
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

/**
 * Removes a player from the game they are involved with
 * @param {string} gameSocketId socket ID player used for the game
 * @returns game ID that player was involved with, null if none
 */
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
    if (
      [GameStatus.CREATED, GameStatus.OPEN].includes(game.status) &&
      game.creatorId === playerId
    ) {
      Logger.debug(`creator ${playerId} left game ${game.id}`);
      updateGame(game.id, { status: GameStatus.DELETED });
      game.playerIds.forEach((pId) => playerLeftGame(pId));
    } else {
      Logger.debug(`player ${playerId} left game ${game.id}`);
      updateGame(game.id, {
        playerIds: game.playerIds.filter((pId) => pId !== playerId),
      });
      playerLeftGame(playerId);
    }
    return game.id;
  }

  Logger.debug("player wasn't involved in any games");
  return null;
}

// private
function generateGameDataAndAnswer(gameName) {
  switch (gameName) {
    case "math-grid":
      return generateMathGrid();
    default:
      throw new Error(`Unknown game name: ${gameName}`);
  }
}

/**
 * Generates the game data
 * @param {string} gameId game ID
 * @returns game data
 */
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

/**
 * Checks whether a game answer is correct
 * @param {string} gameId game ID
 * @param {any} answer the submitted answer
 * @returns true if the answer is correct, false otherwise
 */
function checkGameAnswer(gameId, answer) {
  const game = getGame(gameId, true);
  // TODO select function based on game name
  return checkAnswerMathGrid(game.answer, answer);
}

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
