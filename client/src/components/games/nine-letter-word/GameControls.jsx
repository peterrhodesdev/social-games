import React from "react";
import { TextSubmit } from "../../partials/TextSubmit";

function GameControls({
  guess,
  guessChangeHandler,
  guessSubmitHandler,
  isDisabled,
}) {
  const handleGuessSubmit = (e) => {
    e.preventDefault();
    guessSubmitHandler();
  };

  const handleChange = (e) => guessChangeHandler(e.target.value);

  return (
    <TextSubmit
      submitHandler={handleGuessSubmit}
      textValue={guess}
      onChangeHandler={handleChange}
      placeholderText="enter word..."
      buttonText="Guess"
      isDisabled={isDisabled}
    />
  );
}

export { GameControls };
