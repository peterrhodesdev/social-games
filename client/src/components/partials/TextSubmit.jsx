import React from "react";

function TextSubmit({
  submitHandler,
  textValue,
  onChangeHandler,
  placeholderText,
  buttonText,
}) {
  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-row">
        <input
          className="flex flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-full pl-4 p-2 mr-4"
          type="text"
          value={textValue}
          onChange={onChangeHandler}
          placeholder={placeholderText}
        />
        <input type="submit" value={buttonText} />
      </div>
    </form>
  );
}

export { TextSubmit };
