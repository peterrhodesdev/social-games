import React from "react";

function CommunicationPanel({ creator, players, myPlayerId }) {
  const playersTable = (
    <table>
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
                player.id === myPlayerId ? "(you)" : ""
              }`}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  return (
    <>
      <p>Players</p>
      {playersTable}
    </>
  );
}

export { CommunicationPanel };
