import React from "react";

function Rules({ game }) {
  return (
    <ul>
      {game.rules.map((rule) => (
        <li key={rule}>{rule}</li>
      ))}
    </ul>
  );
}

export { Rules };
