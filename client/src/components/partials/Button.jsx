import React from "react";

function Button({ isSubmit, text, onClickHandler, isDisabled }) {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      onClick={onClickHandler}
      className={`text-gray-900 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 ${
        isDisabled
          ? " bg-gray-300 "
          : " bg-white active:outline-none active:ring-4 active:ring-gray-200 hover:bg-gray-100 "
      }`}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}

export { Button };
