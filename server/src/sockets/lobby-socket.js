import { Logger } from "shared";
import {
  closeGame,
  createNewGame,
  getGame,
  getOpenGameList,
} from "../services/game-service.js";

function socketNamespace(io) {
  io.on("connection", (socket) => {
    Logger.info(`lobby socket connection with id ${socket.id}`);

    socket.on("disconnect", () => {
      Logger.info(`lobby socket with id ${socket.id} disconnected`);
    });

    // Send out the current list of games
    socket.on("game-list", () => {
      socket.emit("game-list", getOpenGameList());
    });

    // Create a new game
    socket.on("create", (gameName) => {
      Logger.info(`create game ${gameName}`);
      const game = createNewGame(socket.id, gameName);
      socket.emit("game-created", game.gameId);
      io.emit("game-list", getOpenGameList());
    });

    // Join an existing game
    socket.on("join", (gameId) => {
      Logger.info(`request to join game ${gameId}`);
      const game = getGame(gameId);
      if (game) {
        // TODO move to signal from creator when everyone has joined
        closeGame(gameId);
        socket.emit("join-success", game.gameId);
        io.emit("game-list", getOpenGameList());
      } else {
        socket.emit("join-fail");
      }
    });
  });
}

export { socketNamespace };
