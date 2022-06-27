import { Logger } from "shared";

function socketNamespace(io) {
  io.on("connection", (socket) => {
    Logger.info(`math-grid socket connection with id ${socket.id}`);

    socket.on("disconnect", () => {
      Logger.info(`math-grid socket with id ${socket.id} disconnected`);
    });

    socket.on("create-room", (gameId) => {
      Logger.info(`creating room ${gameId}`);
      socket.join(gameId);
    });

    socket.on("join-room", (gameId) => {
      Logger.info(`joining room ${gameId}`);
      socket.join(gameId);
      socket.broadcast.to(gameId).emit("partner-join", socket.id);
    });
  });
}

export { socketNamespace };
