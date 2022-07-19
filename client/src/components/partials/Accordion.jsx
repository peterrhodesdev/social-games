import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/outline";

function Accordion({ title, content }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="accordion">
      <div className="accordion-item">
        <button
          type="button"
          className="accordion-title w-full p-2 flex flex-row justify-between border-b-2 border-gray-500 hover:bg-gray-500 hover:text-white"
          onClick={() => setIsActive((prevState) => !prevState)}
        >
          <div>{title}</div>
          <div>
            <ChevronDownIcon
              className={`h-4 w-4 ${isActive ? "rotate-180" : ""}`}
            />
          </div>
        </button>
        {isActive && <div className="accordion-content">{content}</div>}
      </div>
    </div>
  );
}

export { Accordion };
