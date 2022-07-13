import { Logger } from "shared";
import { io } from "socket.io-client";

function createSocket(namespace) {
  Logger.info(`creating new socket for namespace ${namespace}`);
  const newSocket = io(`${process.env.REACT_APP_SERVER_BASE_URL}/${namespace}`);

  newSocket.on("connect", () => {
    Logger.info(
      `connected with socket id ${newSocket.id} for namespace ${namespace}`
    );
  });

  return newSocket;
}

export { createSocket };
