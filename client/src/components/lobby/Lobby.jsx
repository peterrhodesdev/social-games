import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logger } from "shared";
import { usePlayer, useUserSocket } from "../../contexts/UserContext";
import { Spinner } from "../partials/Spinner";
import { CreateGame } from "./CreateGame";
import { GameList } from "./GameList";

function Lobby() {
  const navigate = useNavigate();
  const userSocket = useUserSocket();
  const { player } = usePlayer();

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const joinGameIdRef = useRef(null);
  const gameNameRef = useRef(null);
  const [joinErrorGameId, setJoinErrorGameId] = useState(null);

  function navigateToGameRoom(gameId, isCreator) {
    navigate(`/game/${gameNameRef.current}`, {
      state: {
        gameId,
        gameName: gameNameRef.current,
        isCreator,
      },
    });
  }

  useEffect(() => {
    setIsLoading(true);
    if (!userSocket || !player) {
      return;
    }

    userSocket.on("game-list", (gameList) => {
      setIsLoading(false);
      setGames(gameList);
      Logger.info("received game list", gameList);
    });

    userSocket.on("create-game-success", (gameId) => {
      Logger.info(`game created ${gameId}`);
      navigateToGameRoom(gameId, true);
    });

    userSocket.on("create-game-fail", () => {
      Logger.error("failed to create game");
      gameNameRef.current = null;
    });

    userSocket.on("join-game-request-success", () => {
      Logger.info("request to join game success");
      setJoinErrorGameId(null);
      navigateToGameRoom(joinGameIdRef.current, false);
    });

    userSocket.on("join-game-request-fail", () => {
      Logger.warn(`request to join game fail`);
      setJoinErrorGameId(joinGameIdRef.current);
      joinGameIdRef.current = null;
      gameNameRef.current = null;
    });

    userSocket.emit("get-game-list");
  }, [userSocket, player]);

  const handleCreateGameClick = (gameName, password) => {
    Logger.debug(
      `create game click: GameName = ${gameName}, Password = ${password}`
    );
    gameNameRef.current = gameName;
    setJoinErrorGameId(null);
    userSocket.emit("create-game", gameName, password);
  };

  const handleJoinClick = (gameId, gameName, password) => {
    Logger.debug(
      `join click: GameId = ${gameId}, GameName = ${gameName}, Password = ${password}`
    );
    joinGameIdRef.current = gameId;
    gameNameRef.current = gameName;
    setJoinErrorGameId(null);
    userSocket.emit("join-game-request", gameId, password);
  };

  return (
    <>
      <h1>Lobby</h1>
      {userSocket && player ? (
        <>
          <h3>Create Game</h3>
          <CreateGame
            createGameClickHandler={handleCreateGameClick}
            canCreate={gameNameRef.current === null}
          />
          <h3>Open Games</h3>
          <GameList
            isLoading={isLoading}
            games={games}
            joinClickHandler={handleJoinClick}
            canJoin={
              joinGameIdRef.current === null && gameNameRef.current === null
            }
            joinErrorGameId={joinErrorGameId}
          />
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
}

export { Lobby };
