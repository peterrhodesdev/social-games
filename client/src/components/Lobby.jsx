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

  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const gameNameRef = useRef(null);

  function navigateToGameRoom(gameId, isCreator) {
    navigate(`/game/${gameNameRef.current}`, {
      state: { gameId, gameName: gameNameRef.current, isCreator },
    });
  }

  useEffect(() => {
    setIsLoading(true);
    setSocket(getSocket(`lobby`));
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("game-list", (gameList) => {
      setIsLoading(false);
      setGames(gameList);
      Logger.info("received game list", gameList);
    });

    socket.on("game-created", (gameId) => {
      Logger.info(`game created ${gameId}`);
      navigateToGameRoom(gameId, true);
    });

    socket.on("join-success", (gameId) => {
      Logger.info(`successfully joined game`);
      navigateToGameRoom(gameId, false);
    });

    socket.on("join-fail", () => {
      Logger.info(`failed to join game`);
      // TODO handle fail
    });

    socket.emit("game-list");
  }, [socket]);

  function createGameClicked() {
    const gameName = "math-grid";
    gameNameRef.current = gameName;
    socket.emit("create", gameName);
  }

  function joinGame(gameId, gameName) {
    gameNameRef.current = gameName;
    socket.emit("join", gameId);
  }

  return (
    <>
      <h1>Lobby</h1>
      {socket && socket.id ? (
        <button type="button" onClick={() => createGameClicked()}>
          Create Game
        </button>
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
                key={game.gameId}
                onClick={() => joinGame(game.gameId, game.gameName)}
              >
                <td>{game.creator}</td>
                <td>{game.gameName}</td>
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
