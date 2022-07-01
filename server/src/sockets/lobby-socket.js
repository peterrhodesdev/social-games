import { Logger } from "shared";
import {
  createNewGame,
  getGames,
  GameStatus,
  deleteOpenGamesByPlayer,
  joinGameRequest,
  getGamePublicInfo,
} from "../services/game-service.js";
import { createNewPlayer, getPlayer } from "../services/player-service.js";

let ioSaved = null;

function filterGames(games) {
  return games
    .filter((game) => game.status === GameStatus.OPEN)
    .map((game) => getGamePublicInfo(game.id));
}

function emitGameList() {
  if (ioSaved) {
    ioSaved.emit("game-list", filterGames(getGames()));
  }
}

function socketNamespace(io) {
  ioSaved = io;
  io.on("connection", (socket) => {
    Logger.info(`lobby socket connected: ${socket.id}`);
    const player = createNewPlayer(socket.id);

    socket.on("disconnect", () => {
      Logger.info(`lobby socket disconnected: ${socket.id}`);
      const playerId = player.id;
      const gameId = deleteOpenGamesByPlayer(playerId);
      if (gameId) {
        emitGameList();
      }
    });

    // Get the socket's player
    socket.on("get-my-player", () => {
      socket.emit("my-player", getPlayer(player.id));
    });

    // Gt the list of games
    socket.on("get-game-list", () => {
      socket.emit("game-list", filterGames(getGames()));
    });

    // Create a new game
    socket.on("create-game", (gameName) => {
      Logger.info(`create game ${gameName} for player ${player.id}`);
      try {
        const game = createNewGame(player.id, gameName, io);
        socket.emit("create-game-success", game.id);
      } catch (err) {
        socket.emit("create-game-fail");
      }
    });

    // Join a game
    socket.on("join-game-request", (gameId) => {
      Logger.info(`${player.id} requested to join game ${gameId}`);
      try {
        joinGameRequest(gameId, player.id);
        socket.emit("join-game-request-success");
      } catch (err) {
        Logger.warn("join game request failed");
        socket.emit("join-game-request-fail");
      }
    });
  });
}

export { emitGameList, socketNamespace };
