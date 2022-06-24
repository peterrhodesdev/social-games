import React from "react";

function SolutionSquare({ solution }) {
  return (
    <div className="aspect-square w-full bg-gray-300 flex items-center justify-center">
      <div className="math-grid-square">
        <svg viewBox="0 0 25 25">
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
            {solution}
          </text>
        </svg>
      </div>
    </div>
  );
}

export { SolutionSquare };
