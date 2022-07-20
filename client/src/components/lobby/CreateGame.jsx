import React, { useRef, useState } from "react";
import { getGameByName, getGames } from "../../GameList";
import { Button } from "../partials/Button";
import { Dropdown } from "../partials/Dropdown";
import { Textbox } from "../partials/Textbox";

const gameNameDropdownOptions = getGames().map((game) => ({
  displayText: game.displayName,
  clickValue: game.name,
}));

function CreateGame({ createGameClickHandler, canCreate }) {
  const gameNameRef = useRef(gameNameDropdownOptions[0].clickValue);
  const [gameNameSelected, setGameNameSelected] = useState(
    gameNameDropdownOptions[0].displayText
  );
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-row justify-around rounded-lg border border-gray-500 p-2">
      <div className="flex flex-row items-center">
        <div className="mr-4">Game:</div>
        <Dropdown
          options={gameNameDropdownOptions}
          currentSelection={gameNameSelected}
          clickHandler={(newGameNameSelected) => {
            gameNameRef.current = newGameNameSelected;
            setGameNameSelected(getGameByName(newGameNameSelected).displayName);
          }}
        />
      </div>
      <div className="flex flex-row items-center">
        <div className="mr-4">Password:</div>
        <Textbox
          value={password}
          onChangeHandler={(e) => setPassword(e.target.value)}
          placeholder="set password or leave blank..."
          type="password"
        />
      </div>
      <Button
        text="Create"
        onClickHandler={() =>
          createGameClickHandler(gameNameRef.current, password)
        }
        isDisabled={!canCreate}
      />
    </div>
  );
}

export { CreateGame };
