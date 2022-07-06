import { Logger } from "shared";
import { handleCommonGameMessages } from "./game-socket.js";

function socketNamespace(io) {
  io.on("connection", (socket) => {
    Logger.info(`nine-letter-word socket connection with id ${socket.id}`);

    handleCommonGameMessages(io, socket);
  });
}

export { socketNamespace };
