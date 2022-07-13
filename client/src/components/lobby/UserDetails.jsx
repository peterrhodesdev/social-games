import React from "react";
import { usePlayer } from "../../contexts/UserContext";

function UserDetails() {
  const player = usePlayer();

  return (
    <div>
      {player ? (
        <div>
          <div>
            Connected as: <strong>{player.name}</strong>
          </div>
        </div>
      ) : (
        "connecting..."
      )}
    </div>
  );
}

export { UserDetails };
