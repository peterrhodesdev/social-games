import { Logger } from "shared";
import { gameCompleted, getAnswer } from "../services/game-service.js";
import { handleCommonGameMessages } from "./game-socket.js";

function socketNamespace(io) {
  io.on("connection", (socket) => {
    Logger.info(`nine-letter-word socket connection with id ${socket.id}`);

    handleCommonGameMessages(io, socket);

    // Player has entered a word
    socket.on("word-entered", (gameId, word) => {
      Logger.info(`game ${gameId} word "${word}" entered by ${socket.id}`);
      const answer = getAnswer(gameId);
      if (answer.list.includes(word)) {
        io.in(gameId).emit("word-correct", word);
      } else {
        io.in(gameId).emit("word-incorrect", word);
      }
    });

    // Players submit answer to finish game
    socket.on("game-finished", (gameId) => {
      Logger.info(`game ${gameId} finished`);
      gameCompleted(gameId);
      const answer = getAnswer(gameId);
      io.in(gameId).emit("game-answer", answer);
    });
  });
}

export { socketNamespace };
