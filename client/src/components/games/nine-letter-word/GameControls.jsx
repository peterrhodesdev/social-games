import React, { useState } from "react";

function GameControls({ wordSubmitHandler }) {
  const [word, setWord] = useState("");

  function handleWordSubmit(e) {
    e.preventDefault();
    wordSubmitHandler(word.toLowerCase());
    setWord("");
  }

  return (
    <form id="gameControlForm" onSubmit={handleWordSubmit}>
      <div className="flex flex-row">
        <input
          className="flex flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-full pl-4 p-2 mr-4"
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="enter word..."
        />
        <input type="submit" value="Enter" />
      </div>
    </form>
  );
}

export { GameControls };
