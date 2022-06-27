import { Logger } from "shared";
import {
  createNewGame,
  getGame,
  getGameList,
  removeGameFromList,
} from "../services/game-service.js";

function socketNamespace(io) {
  io.on("connection", (socket) => {
    Logger.info(`lobby socket connection with id ${socket.id}`);

    socket.on("disconnect", () => {
      Logger.info(`lobby socket with id ${socket.id} disconnected`);
    });

    // Send out the current list of games
    socket.on("game-list", () => {
      socket.emit("game-list", getGameList());
    });

    // Create a new game
    socket.on("create", (gameName) => {
      Logger.info(`create game ${gameName}`);
      const game = createNewGame(socket.id, gameName);
      socket.emit("game-created", game);
      io.emit("game-list", getGameList());
    });

    // Join an existing game
    socket.on("join", (id) => {
      Logger.info(`request to join game ${id}`);
      const game = getGame(id);
      if (game) {
        removeGameFromList(id);
        socket.emit("join-success", game);
        io.emit("game-list", getGameList());
      } else {
        socket.emit("join-fail");
      }
    });
  });
}

export { socketNamespace };
