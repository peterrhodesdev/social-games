import React from "react";

function UserDetails({ playerName }) {
  return (
    <p>
      Connected as: <strong>{playerName ?? "connecting ..."}</strong>
    </p>
  );
}

export { UserDetails };
