import React, { useEffect, useState } from "react";
import { Logger } from "shared";
import { usePlayer, useUserSocket } from "../contexts/UserContext";
import { TextSubmit } from "./partials/TextSubmit";

const maxPlayerNameLength = 12;

function User() {
  const userSocket = useUserSocket();
  const { player, updatePlayerName } = usePlayer();
  const [newPlayerName, setNewPlayerName] = useState(player ? player.name : "");
  const [nameChangeResult, setNameChangeResult] = useState(null);

  useEffect(() => {
    if (!userSocket || !player) {
      return () => {};
    }

    const playerNameChangeSuccess = (changedPlayerName) => {
      Logger.info(`player name change success: ${changedPlayerName}`);
      setNameChangeResult({ isSuccess: true });
      updatePlayerName(changedPlayerName);
    };
    userSocket.on("player-name-change-success", playerNameChangeSuccess);

    const playerNameChangeFail = () => {
      Logger.info(`player name change fail`);
      setNameChangeResult({ isSuccess: false, message: "Name already in use" });
    };
    userSocket.on("player-name-change-fail", playerNameChangeFail);

    return () => {
      userSocket.off("player-name-change-success", playerNameChangeSuccess);
      userSocket.off("player-name-change-fail", playerNameChangeFail);
    };
  }, [userSocket, player]);

  function isNameValid() {
    if (
      newPlayerName.length === 0 ||
      newPlayerName.length > maxPlayerNameLength
    ) {
      setNameChangeResult({
        isSuccess: false,
        message: `Name must be 1-${maxPlayerNameLength} characters long`,
      });
      return false;
    }

    if (newPlayerName === player.name) {
      setNameChangeResult({
        isSuccess: false,
        message: "please choose a different name",
      });
      return false;
    }
    return true;
  }

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (isNameValid()) {
      userSocket.emit("player-name-change", newPlayerName);
    }
  };

  const handleChange = (e) => {
    setNewPlayerName(e.target.value);
    setNameChangeResult(null);
  };

  return (
    <div>
      <h1>User profile</h1>
      {player ? (
        <>
          <div className="flex flex-row items-center">
            <div className="mr-4">Player name:</div>
            <TextSubmit
              submitHandler={handleNameSubmit}
              textValue={newPlayerName}
              onChangeHandler={handleChange}
              placeholderText="enter new name..."
              buttonText="edit"
              isDisabled={!player}
            />
          </div>
          {nameChangeResult && (
            <p
              className={
                nameChangeResult.isSuccess ? "text-green-500" : "text-red-500"
              }
            >
              {nameChangeResult.isSuccess
                ? "name changed"
                : nameChangeResult.message}
            </p>
          )}
        </>
      ) : (
        "connecting..."
      )}
    </div>
  );
}

export { User };
