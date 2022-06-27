import React, { useEffect, useState } from "react";
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

  const [socketConnection, setSocketConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);

  function navigateToGameRoom(game, isCreator) {
    navigate(`/game/${game.gameName}`, { state: { isCreator, ...game } });
  }

  useEffect(() => {
    setIsLoading(true);
    const socket = getSocket(`lobby`);
    setSocketConnection(socket);

    socket.on("game-list", (gameList) => {
      setIsLoading(false);
      setGames(gameList);
      Logger.info("received game list", gameList);
    });

    socket.on("game-created", (game) => {
      Logger.info("game created", game);
      navigateToGameRoom(game, true);
    });

    socket.on("join-success", (game) => {
      Logger.info(`successfully joined game`);
      navigateToGameRoom(game, false);
    });

    socket.on("join-fail", () => {
      Logger.info(`failed to join game`);
      // TODO handle fail
    });

    socket.emit("game-list");
  }, []);

  function createGameClicked() {
    socketConnection.emit("create", "math-grid");
  }

  function joinGame(id) {
    socketConnection.emit("join", id);
  }

  return (
    <>
      <h1>Lobby</h1>
      {socketConnection && socketConnection.id ? (
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
              <tr key={game.id} onClick={() => joinGame(game.id)}>
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
