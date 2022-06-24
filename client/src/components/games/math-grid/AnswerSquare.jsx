import React from "react";

function AnswerSquare({ clickHandler, value, isActive, notesValues }) {
  let bg = " bg-white hover:bg-gray-100 ";
  if (isActive) {
    bg = " bg-yellow-300 hover:bg-yellow-400 ";
  } else if (value) {
    bg = " bg-blue-300 hover:bg-blue-400 ";
  }

  return (
    <div className="aspect-square w-full flex items-center justify-center">
      <button
        type="button"
        className={`w-full h-full ${bg}`}
        onClick={clickHandler}
      >
        {value && (
          <svg viewBox="0 0 30 30">
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {value}
            </text>
          </svg>
        )}
        {notesValues && (
          <div className="flex flex-col aspect-square">
            {[0, 1, 2].map((row) => (
              <div className="flex grow flex-row">
                {[0, 1, 2].map((col) => {
                  const nv = row * 3 + col + 1;
                  return (
                    <div className="aspect-square w-full">
                      {notesValues.includes(nv) ? (
                        <svg viewBox="0 0 30 30">
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ fill: "gray" }}
                          >
                            {nv}
                          </text>
                        </svg>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </button>
    </div>
  );
}

export { AnswerSquare };
