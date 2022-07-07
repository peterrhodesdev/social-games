import React from "react";
import { Button } from "./Button";

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
        <input
          className="flex flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-full pl-4 p-2 mr-4"
          type="text"
          value={textValue}
          onChange={onChangeHandler}
          placeholder={placeholderText}
          disabled={isDisabled}
        />
        <Button isSubmit text={buttonText} isDisabled={isDisabled} />
      </div>
    </form>
  );
}

export { TextSubmit };
