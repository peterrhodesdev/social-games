import { Logger } from "shared";
import { checkGameAnswer, getGame } from "../services/game-service.js";

function socketNamespace(io) {
  io.on("connection", (socket) => {
    Logger.info(`math-grid socket connection with id ${socket.id}`);

    socket.on("disconnect", () => {
      Logger.info(`math-grid socket with id ${socket.id} disconnected`);
    });

    // Creator of the game requested to create the game room
    socket.on("create-room", (gameId) => {
      Logger.info(`creating room ${gameId}`);
      socket.join(gameId);
    });

    // User requested to join game
    socket.on("join-room", (gameId) => {
      Logger.info(`joining room ${gameId}`);
      socket.join(gameId);
      socket.broadcast.to(gameId).emit("partner-join", socket.id);
      const game = getGame(gameId);
      io.in(gameId).emit("game-data", game.gameData);
    });

    // Creator requested to start the game
    socket.on("start", (gameId) => {
      Logger.info(`start game ${gameId}`);
      io.in(gameId).emit("start");
    });

    // Player has changed the game state
    socket.on("game-state", (gameId, gameState) => {
      Logger.info(`game ${gameId} state changed by ${socket.id}`);
      socket.broadcast.to(gameId).emit("game-state", gameState);
    });

    // Players submit answer for checking
    socket.on("check-answer", (gameId, answer) => {
      Logger.info(`checking answer for game ${gameId}`, answer);
      io.in(gameId).emit("answer-checked", checkGameAnswer(gameId, answer));
    });
  });
}

export { socketNamespace };
