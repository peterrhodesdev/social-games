import { Logger } from "shared";
import { emitGameList } from "./user-socket.js";
import {
  createRoom,
  deletePlayerFromGame,
  generateGameData,
  getGamePublicInfo,
  getPlayerAndGameByGameSocket,
  joinRoom,
} from "../services/game-service.js";
import {
  getPlayer,
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
    const [playerId, gameId] = getPlayerAndGameByGameSocket(socket.id);
    if (playerId && gameId) {
      deletePlayerFromGame(playerId, gameId);
      emitGameList();
      emitPlayerList(io, gameId);
      socket.broadcast.to(gameId).emit("player-left-game", playerId);
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
      emitGameList();
      emitPlayerList(io, gameId);
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

  // Chat message
  socket.on("chat-message-send", (gameId, playerId, message) => {
    Logger.debug("chat message");
    const player = getPlayer(playerId);
    socket.broadcast
      .to(gameId)
      .emit("chat-message-receive", player.name, message);
  });

  /* Video chat */

  // Player ready for call
  socket.on("ready-for-call", (gameId, playerId) => {
    Logger.info(`player ${playerId} in game ${gameId} ready for call`);
    socket.broadcast.to(gameId).emit("player-ready-for-call", playerId);
  });

  // Player can't be called
  socket.on("cant-call", (gameId, playerId) => {
    Logger.info(`player ${playerId} in game ${gameId} can't be called`);
    socket.broadcast.to(gameId).emit("player-cant-be-called", playerId);
  });

  // Call player
  socket.on("call-player", (fromPlayerId, toPlayerId, signalData) => {
    Logger.info(`call from ${fromPlayerId} to ${toPlayerId}`);
    const toPlayer = getPlayer(toPlayerId);
    io.to(toPlayer.gameSocketId).emit(
      "player-calling",
      fromPlayerId,
      signalData
    );
  });

  // Answer player call
  socket.on("answer-player-call", (toPlayerId, signal) => {
    Logger.info(`answering player call: ${toPlayerId}`);
    const toPlayer = getPlayer(toPlayerId);
    io.to(toPlayer.gameSocketId).emit("call-accepted", signal);
  });
}

export { handleCommonGameMessages };
