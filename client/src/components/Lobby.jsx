import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logger } from "shared";
import { Spinner } from "./partials/Spinner";
import { getSocket } from "../services/SocketService";

const columns = [
  { key: "creator", text: "Creator" },
  { key: "game-name", text: "Game Name" },
  { key: "join", text: "" },
];

function Lobby() {
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [playerName, setPlayerName] = useState(null);
  const playerIdRef = useRef(null);
  const joinGameIdRef = useRef(null);
  const gameNameRef = useRef(null);

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
    });

    socketRef.current.on("join-game-request-success", () => {
      Logger.info("request to join game success");
      navigateToGameRoom(joinGameIdRef.current, false);
    });

    socketRef.current.on("join-game-request-fail", () => {
      Logger.warn(`request to join game fail`);
      joinGameIdRef.current = null;
      gameNameRef.current = null;
    });

    socketRef.current.emit("get-my-player");
    socketRef.current.emit("get-game-list");
  }, []);

  function createGameClicked() {
    const gameName = "math-grid";
    gameNameRef.current = gameName;
    socketRef.current.emit("create-game", gameName);
  }

  function joinGameRequest(gameId, gameName) {
    joinGameIdRef.current = gameId;
    gameNameRef.current = gameName;
    socketRef.current.emit("join-game-request", gameId);
  }

  return (
    <>
      <h1>Lobby</h1>
      {socketRef.current ? (
        <>
          <p>Connected as: {playerName ?? "connecting ..."}</p>
          <button type="button" onClick={() => createGameClicked()}>
            Create Game
          </button>
        </>
      ) : (
        <p>Waiting for connection...</p>
      )}
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.text}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length}>
                <Spinner />
              </td>
            </tr>
          ) : (
            games.map((game) => (
              <tr
                key={game.id}
                onClick={() => joinGameRequest(game.id, game.name)}
              >
                <td>{game.creator.name}</td>
                <td>{game.name}</td>
                <td>
                  <button type="button">join</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export { Lobby };
