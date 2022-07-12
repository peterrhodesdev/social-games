import React from "react";

function Textbox({ value, onChangeHandler, placeholder, isDisabled }) {
  return (
    <input
      className="flex flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg w-full pl-4 p-2 mr-4"
      type="text"
      value={value}
      onChange={onChangeHandler}
      placeholder={placeholder}
      disabled={isDisabled}
    />
  );
}

export { Textbox };
