import { Logger } from "shared";
import { emitGameList } from "./lobby-socket.js";
import {
  createRoom,
  deletePlayerFromGames,
  generateGameData,
  getGamePublicInfo,
  joinRoom,
} from "../services/game-service.js";
import {
  playerJoinedGameRoom,
  PlayerStatus,
} from "../services/player-service.js";

function emitPlayerList(io, gameId) {
  try {
    const game = getGamePublicInfo(gameId);
    io.in(gameId).emit(
      "player-list",
      game.creator,
      game.players.filter((p) => p.status === PlayerStatus.JOINED)
    );
  } catch (err) {
    // game or player deleted
  }
}

function handleCommonGameMessages(io, socket) {
  socket.on("disconnect", () => {
    Logger.info(`math-grid socket with id ${socket.id} disconnected`);
    const gameId = deletePlayerFromGames(socket.id);
    if (gameId) {
      emitGameList();
      emitPlayerList(io, gameId);
    }
  });

  // Player requested to create a game room
  socket.on("create-room", (gameId, playerId) => {
    Logger.info(`player ${playerId} requested to create room ${gameId}`);
    try {
      createRoom(gameId, playerId);
      playerJoinedGameRoom(playerId, gameId, socket.id);
      socket.join(gameId);
      socket.emit("create-room-success");
      // TODO remove emit and on fail delete game
      emitGameList();
      emitPlayerList(io, gameId);
    } catch (err) {
      Logger.error("failed to create room");
      // TODO delete game
      socket.emit("create-room-fail");
    }
  });

  // Player requested to join game room
  socket.on("join-room", (gameId, playerId) => {
    Logger.info(`player ${playerId} requested to join room ${gameId}`);
    try {
      joinRoom(gameId, playerId);
      playerJoinedGameRoom(playerId, gameId, socket.id);
      socket.join(gameId);
      socket.emit("join-room-success");
      emitPlayerList(io, gameId);
      // TODO move game data being sent to later
      // io.in(gameId).emit("game-data", game.gameData);
    } catch (err) {
      Logger.warn("unable to join room");
      socket.emit("join-room-fail");
    }
  });

  // Creator requested to start the game
  socket.on("generate-game-data", (gameId) => {
    Logger.info(`start game ${gameId}`);
    io.in(gameId).emit("generate-game-data-in-progress");
    try {
      const gameData = generateGameData(gameId);
      io.in(gameId).emit("generate-game-data-success", gameData);
      emitGameList();
    } catch (err) {
      Logger.error("unable to generate game data");
      io.in(gameId).emit("generate-game-data-fail");
    }
  });
}

export { handleCommonGameMessages };
