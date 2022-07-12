import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logger } from "shared";
import { getSocket } from "../../services/SocketService";
import { Spinner } from "../partials/Spinner";
import { CreateGame } from "./CreateGame";
import { GameList } from "./GameList";
import { UserDetails } from "./UserDetails";

function Lobby() {
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [playerName, setPlayerName] = useState(null);
  const playerIdRef = useRef(null);
  const joinGameIdRef = useRef(null);
  const gameNameRef = useRef(null);
  const [joinErrorGameId, setJoinErrorGameId] = useState(null);

  function navigateToGameRoom(gameId, isCreator) {
    navigate(`/game/${gameNameRef.current}`, {
      state: {
        gameId,
        gameName: gameNameRef.current,
        isCreator,
        playerId: playerIdRef.current,
      },
    });
  }

  useEffect(() => {
    setIsLoading(true);
    socketRef.current = getSocket("lobby", true);

    socketRef.current.on("my-player", (myPlayer) => {
      playerIdRef.current = myPlayer.id;
      setPlayerName(myPlayer.name);
      Logger.info("received my player", myPlayer);
    });

    socketRef.current.on("game-list", (gameList) => {
      setIsLoading(false);
      setGames(gameList);
      Logger.info("received game list", gameList);
    });

    socketRef.current.on("create-game-success", (gameId) => {
      Logger.info(`game created ${gameId}`);
      navigateToGameRoom(gameId, true);
    });

    socketRef.current.on("create-game-fail", () => {
      Logger.error("failed to create game");
      gameNameRef.current = null;
    });

    socketRef.current.on("join-game-request-success", () => {
      Logger.info("request to join game success");
      setJoinErrorGameId(null);
      navigateToGameRoom(joinGameIdRef.current, false);
    });

    socketRef.current.on("join-game-request-fail", () => {
      Logger.warn(`request to join game fail`);
      setJoinErrorGameId(joinGameIdRef.current);
      joinGameIdRef.current = null;
      gameNameRef.current = null;
    });

    socketRef.current.emit("get-my-player");
    socketRef.current.emit("get-game-list");
  }, []);

  const handleCreateGameClick = (gameName, password) => {
    Logger.debug(
      `create game click: GameName = ${gameName}, Password = ${password}`
    );
    gameNameRef.current = gameName;
    setJoinErrorGameId(null);
    socketRef.current.emit("create-game", gameName, password);
  };

  const handleJoinClick = (gameId, gameName, password) => {
    Logger.debug(
      `join click: GameId = ${gameId}, GameName = ${gameName}, Password = ${password}`
    );
    joinGameIdRef.current = gameId;
    gameNameRef.current = gameName;
    setJoinErrorGameId(null);
    socketRef.current.emit("join-game-request", gameId, password);
  };

  return (
    <>
      <h1>Lobby</h1>
      {socketRef.current ? (
        <>
          <UserDetails playerName={playerName} />
          <h3>Create Game</h3>
          <CreateGame
            createGameClickHandler={handleCreateGameClick}
            canCreate={gameNameRef.current === null}
          />
        </>
      ) : (
        <Spinner />
      )}
      <h3>Open Games</h3>
      <GameList
        isLoading={isLoading}
        games={games}
        joinClickHandler={handleJoinClick}
        canJoin={joinGameIdRef.current === null && gameNameRef.current === null}
        joinErrorGameId={joinErrorGameId}
      />
    </>
  );
}

export { Lobby };
