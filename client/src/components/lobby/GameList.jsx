import React, { useState } from "react";
import { getGameByName } from "../../GameList";
import { Button } from "../partials/Button";
import { Spinner } from "../partials/Spinner";
import { Textbox } from "../partials/Textbox";

const openGameTableColumns = [
  { key: "creator", text: "Creator" },
  { key: "game-name", text: "Game Name" },
  { key: "players", text: "Players" },
  { key: "password", text: "Password" },
  { key: "join", text: "" },
];

function GameList({
  isLoading,
  games,
  joinClickHandler,
  canJoin,
  joinErrorGameId,
}) {
  const [passwords, setPasswords] = useState({});

  const tableRows =
    !games || games.length === 0 ? (
      <tr>
        <td colSpan={openGameTableColumns.length} className="text-center">
          No games available
        </td>
      </tr>
    ) : (
      games.map((game) => (
        <tr key={game.id}>
          <td>{game.creator.name}</td>
          <td>{getGameByName(game.name).displayName}</td>
          <td>{game.players ? game.players.length : 0}</td>
          <td className="flex flex-col items-end">
            <Textbox
              value={passwords[game.id]}
              onChangeHandler={(e) =>
                setPasswords({ ...passwords, [game.id]: e.target.value })
              }
              placeholder="enter password..."
            />
          </td>
          <td>
            <div>
              <Button
                text="Join"
                onClickHandler={() => {
                  if (canJoin) {
                    joinClickHandler(
                      game.id,
                      game.name,
                      Object.hasOwn(passwords, game.id)
                        ? passwords[game.id]
                        : ""
                    );
                  }
                }}
              />
            </div>
            {joinErrorGameId === game.id ? (
              <div className="grow text-center text-red-500">Error</div>
            ) : null}
          </td>
        </tr>
      ))
    );

  return (
    <table className="select-none">
      <thead>
        <tr>
          {openGameTableColumns.map((col) => (
            <th key={col.key}>{col.text}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={openGameTableColumns.length}>
              <Spinner />
            </td>
          </tr>
        ) : (
          tableRows
        )}
      </tbody>
    </table>
  );
}

export { GameList };
