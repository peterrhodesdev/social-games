import React from "react";

function Controls({ game }) {
  return (
    <ul>
      {game.controls.map((control) => (
        <li key={control}>{control}</li>
      ))}
    </ul>
  );
}

export { Controls };
