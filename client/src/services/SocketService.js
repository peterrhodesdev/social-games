import { Logger } from "shared";
import { io } from "socket.io-client";

const socketConnections = [];

function createSocket(namespace) {
  Logger.info(`creating new socket for namespace ${namespace}`);
  const newSocket = io(`${process.env.REACT_APP_SERVER_BASE_URL}/${namespace}`);

  newSocket.on("connect", () => {
    Logger.info(
      `connected with socket id ${newSocket.id} for namespace ${namespace}`
    );
  });

  socketConnections.push({ namespace, socket: newSocket });

  return newSocket;
}

function getSocket(namespace) {
  const socketConnection = socketConnections.find(
    (s) => s.namespace === namespace
  );
  if (socketConnection) {
    Logger.debug(
      `returning existing socket ${socketConnection.socket.id} for namespace ${namespace}`
    );
    return socketConnection.socket;
  }
  return createSocket(namespace);
}

export { getSocket };
