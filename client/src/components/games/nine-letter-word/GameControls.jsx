import React, { useState } from "react";
import { TextSubmit } from "../../partials/TextSubmit";

function GameControls({ wordSubmitHandler }) {
  const [word, setWord] = useState("");

  const handleWordSubmit = (e) => {
    e.preventDefault();
    wordSubmitHandler(word.toLowerCase());
    setWord("");
  };

  const handleChange = (e) => setWord(e.target.value);

  return (
    <TextSubmit
      submitHandler={handleWordSubmit}
      textValue={word}
      onChangeHandler={handleChange}
      placeholderText="enter word..."
      buttonText="Enter"
    />
  );
}

export { GameControls };
