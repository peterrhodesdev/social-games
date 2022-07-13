import React from "react";
import { usePlayer } from "../../contexts/UserContext";

function PlayersTable({ creator, players }) {
  const myPlayer = usePlayer();

  return (
    <div className="w-full h-36 overflow-y-scroll select-none">
      <table className="my-0 py-0">
        <thead>
          <tr>
            <th>Name</th>
            <th aria-label="info" />
          </tr>
        </thead>
        <tbody>
          {creator &&
            players &&
            players.map((player) => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{`${creator.id === player.id ? "Creator " : ""}${
                  player.id === myPlayer.id ? "(you)" : ""
                }`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export { PlayersTable };
