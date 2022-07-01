import { Logger } from "shared";
import { v4 as uuidv4 } from "uuid";
import { randomInt } from "../utils/random-utils.js";

let players = [];

const PlayerStatus = Object.freeze({
  CONNECTED: "CONNECTED", // in lobby
  CREATED_GAME: "CREATED_GAME", // clicked create game
  REQUESTED_TO_JOIN: "REQUESTED_TO_JOIN", // clicked join
  JOINED: "JOINED", // in game room
  DELETED: "DELETED",
});

/**
 * Creates a new player
 * @param {string} lobbySocketId socket ID for the lobby namespace
 * @returns {Player} new player
 * @throws if lobbySocketId is not unique
 */
function createNewPlayer(lobbySocketId) {
  if (players.some((p) => p.lobbySocketId === lobbySocketId)) {
    Logger.logAndThrowError(
      `player with lobby socket ID ${lobbySocketId} already created`
    );
  }

  const player = {
    id: uuidv4(),
    name: `player${randomInt(100000, 999999)}`,
    status: PlayerStatus.CONNECTED,
    lobbySocketId,
    currentGameId: null,
    gameSocketId: null,
  };
  // player.public = () => (({ id, name }) => ({ id, name }))(player);
  players.push(player);
  Logger.info("created new player", player);

  return player;
}

/**
 * Gets all players
 * @returns {Array} players
 */
function getPlayers() {
  return players;
}

/**
 * Gets a player
 * @param {string} playerId ID of the player
 * @returns {Player} player
 * @throws if the player is not found
 */
function getPlayer(playerId) {
  const player = players.find((p) => p.id === playerId);
  if (!player) {
    Logger.logAndThrowError(`player ${playerId} not found`);
  }
  return player;
}

function getPlayerPublicInfo(playerId) {
  const player = getPlayer(playerId);
  return {
    id: player.id,
    name: player.name,
    status: player.status,
  };
}

// private
function updatePlayer(playerId, partialPlayer) {
  players = players.map((player) =>
    player.id === playerId ? { ...player, ...partialPlayer } : player
  );
}

/**
 * Deletes the player from the list of players
 * @param {string} playerId player ID
 * @returns {string} game ID that player is involved with, null if none
 */
function deletePlayer(playerId) {
  updatePlayer(playerId, {
    status: PlayerStatus.DELETED,
    currentGameId: null,
    gameSocketId: null,
  });
}

function playerCreatedGame(playerId, gameId) {
  updatePlayer(playerId, {
    status: PlayerStatus.CREATED_GAME,
    currentGameId: gameId,
  });
}

function playerRequestedToJoinGame(playerId, gameId) {
  updatePlayer(playerId, {
    status: PlayerStatus.REQUESTED_TO_JOIN,
    currentGameId: gameId,
  });
}

function playerJoinedGameRoom(playerId, gameId, socketId) {
  updatePlayer(playerId, {
    status: PlayerStatus.JOINED,
    gameSocketId: socketId,
    joinedGameId: gameId,
  });
}

export {
  createNewPlayer,
  deletePlayer,
  getPlayer,
  getPlayerPublicInfo,
  getPlayers,
  playerCreatedGame,
  playerJoinedGameRoom,
  playerRequestedToJoinGame,
  PlayerStatus,
};
