import { Logger } from "shared";
import { handleCommonGameMessages } from "./game-socket.js";
import { gameCompleted, getAnswer } from "../services/game-service.js";
import { checkAnswer } from "../games/math-grid.js";

function socketNamespace(io) {
  io.on("connection", (socket) => {
    Logger.info(`math-grid socket connection with id ${socket.id}`);

    handleCommonGameMessages(io, socket);

    // Player has changed the game state
    socket.on("game-state", (gameId, gameState) => {
      Logger.info(`game ${gameId} state changed by ${socket.id}`);
      socket.broadcast.to(gameId).emit("game-state", gameState);
    });

    // Players submit answer for checking
    socket.on("check-answer", (gameId, actualAnswer) => {
      Logger.info(`checking answer for game ${gameId}`, actualAnswer);
      const expectedAnswer = getAnswer(gameId);
      const isCorrect = checkAnswer(expectedAnswer, actualAnswer);
      if (isCorrect) {
        gameCompleted(gameId);
      }
      io.in(gameId).emit("answer-checked", isCorrect);
    });
  });
}

export { socketNamespace };
