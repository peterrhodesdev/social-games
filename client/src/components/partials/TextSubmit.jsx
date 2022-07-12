import React from "react";
import { Button } from "./Button";
import { Textbox } from "./Textbox";

function TextSubmit({
  submitHandler,
  textValue,
  onChangeHandler,
  placeholderText,
  buttonText,
  isDisabled,
}) {
  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-row items-center">
        <Textbox
          value={textValue}
          onChangeHandler={onChangeHandler}
          placeholder={placeholderText}
          isDisabled={isDisabled}
        />
        <Button isSubmit text={buttonText} isDisabled={isDisabled} />
      </div>
    </form>
  );
}

export { TextSubmit };
