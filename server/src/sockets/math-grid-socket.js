import { Logger } from "shared";

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
  });
}

export { socketNamespace };
