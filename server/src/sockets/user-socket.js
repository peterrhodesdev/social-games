import { Logger } from "shared";
import {
  createNewGame,
  getGames,
  GameStatus,
  deleteOpenGamesByPlayer,
  joinGameRequest,
  getGamePublicInfo,
} from "../services/game-service.js";
import {
  createNewPlayer,
  getPlayer,
  updatePlayerName,
} from "../services/player-service.js";

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
    Logger.info(`user socket connected: ${socket.id}`);
    const player = createNewPlayer(socket.id);

    socket.on("disconnect", () => {
      Logger.info(`user socket disconnected: ${socket.id}`);
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

    // Change player name
    socket.on("player-name-change", (newPlayerName) => {
      if (updatePlayerName(player.id, newPlayerName)) {
        socket.emit("player-name-change-success", newPlayerName);
      } else {
        socket.emit("player-name-change-fail");
      }
    });

    // Get the list of games
    socket.on("get-game-list", () => {
      socket.emit("game-list", filterGames(getGames()));
    });

    // Create a new game
    socket.on("create-game", (gameName, password) => {
      Logger.info(
        `create game ${gameName} for player ${player.id} with password ${password}`
      );
      try {
        const game = createNewGame(player.id, gameName, password);
        socket.emit("create-game-success", game.id);
      } catch (err) {
        socket.emit("create-game-fail");
      }
    });

    // Join a game
    socket.on("join-game-request", (gameId, password) => {
      Logger.info(
        `${player.id} requested to join game ${gameId} with password ${password}`
      );
      try {
        joinGameRequest(gameId, player.id, password);
        socket.emit("join-game-request-success");
      } catch (err) {
        Logger.warn("join game request failed");
        socket.emit("join-game-request-fail");
      }
    });
  });
}

export { emitGameList, socketNamespace };
