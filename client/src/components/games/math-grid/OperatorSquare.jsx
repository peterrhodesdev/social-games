import React from "react";

function OperatorSquare({ operator }) {
  return (
    <div className="aspect-square w-full bg-gray-500 flex items-center justify-center">
      <div className="game-square">
        <svg viewBox="0 0 20 20">
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
            {operator}
          </text>
        </svg>
      </div>
    </div>
  );
}

export { OperatorSquare };
