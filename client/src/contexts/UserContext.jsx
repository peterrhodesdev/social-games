import React, { useContext, useEffect, useState } from "react";
import { Logger } from "shared";
import { createSocket } from "../services/SocketService";

const SocketContext = React.createContext();
const PlayerContext = React.createContext();

function useUserSocket() {
  return useContext(SocketContext);
}

function usePlayer() {
  return useContext(PlayerContext);
}

function UserProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const userSocket = createSocket("user");
    setSocket(userSocket);

    userSocket.on("my-player", (myPlayer) => {
      Logger.info("received my player", myPlayer);
      setPlayer({ id: myPlayer.id, name: myPlayer.name });
    });

    userSocket.emit("get-my-player");

    return () => userSocket.disconnect();
  }, []);

  const playerMemo = React.useMemo(
    () => ({
      player,
      updatePlayerName: (newPlayerName) =>
        setPlayer((prevState) => ({ ...prevState, name: newPlayerName })),
    }),
    [player]
  );

  return (
    <SocketContext.Provider value={socket}>
      <PlayerContext.Provider value={playerMemo}>
        {children}
      </PlayerContext.Provider>
    </SocketContext.Provider>
  );
}

export { UserProvider, usePlayer, useUserSocket };
