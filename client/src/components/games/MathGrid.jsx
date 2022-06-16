import React, { useEffect, useState } from "react";
import { getOne } from "../../services/HttpService";

const SquareTypes = Object.freeze({
  ANSWER: Symbol("answer"),
  OPERATOR: Symbol("operator"),
  SOLUTION: Symbol("solution"),
});

function MathGrid() {
  const [game, setGame] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const getNewGame = async () => {
      setStatusMessage("Loading");
      try {
        const response = await getOne(
          `${process.env.REACT_APP_SERVER_BASE_URL}/api/game`,
          "math-grid"
        );
        setGame(response.parsedBody);
        setStatusMessage(null);
      } catch (err) {
        setStatusMessage("Error");
      }
    };

    getNewGame();
  }, []);

  function getDisplayOperator(symbol) {
    switch (symbol) {
      case "+":
        return "\u002B";
      case "-":
        return "\u2212";
      case "*":
        return "\u00D7";
      case "/":
        return "\u00F7";
      default:
        return symbol;
    }
  }

  function getAnswerSquares() {
    const answerSquares = [];
    [0, 2, 4].forEach((rowIndex) =>
      [0, 2, 4].forEach((colIndex) =>
        answerSquares.push({
          row: rowIndex,
          col: colIndex,
        })
      )
    );
    return answerSquares;
  }

  function getOperatorSquares() {
    const operatorSquares = [];
    game.rowOperators.forEach((row, rowIndex) =>
      row.forEach((element, colIndex) =>
        operatorSquares.push({
          row: rowIndex * 2,
          col: colIndex * 2 + 1,
          operator: getDisplayOperator(element),
        })
      )
    );
    game.colOperators.forEach((row, rowIndex) =>
      row.forEach((element, colIndex) =>
        operatorSquares.push({
          row: colIndex * 2 + 1,
          col: rowIndex * 2,
          operator: getDisplayOperator(element),
        })
      )
    );
    operatorSquares.push(
      ...[0, 1, 2].map((index) => ({ row: index * 2, col: 5, operator: "=" }))
    );
    operatorSquares.push(
      ...[0, 1, 2].map((index) => ({ row: 5, col: index * 2, operator: "=" }))
    );
    return operatorSquares;
  }

  function getSolutionSquares() {
    const solutionSquares = [];
    solutionSquares.push(
      ...game.rowSolutions.map((solution, index) => ({
        row: index * 2,
        col: 6,
        value: solution,
      }))
    );
    solutionSquares.push(
      ...game.colSolutions.map((solution, index) => ({
        row: 6,
        col: index * 2,
        value: solution,
      }))
    );
    return solutionSquares;
  }

  function getSquares() {
    return [].concat(
      getAnswerSquares().map((square) => ({
        ...square,
        type: SquareTypes.ANSWER,
      })),
      getOperatorSquares().map((square) => ({
        ...square,
        type: SquareTypes.OPERATOR,
      })),
      getSolutionSquares().map((square) => ({
        ...square,
        type: SquareTypes.SOLUTION,
      }))
    );
  }

  function createAnswerSquare() {
    return (
      <div className="aspect-square w-full bg-white flex items-center justify-center" />
    );
  }

  function createOperatorSquare(text) {
    return (
      <div className="aspect-square w-full bg-gray-500 flex items-center justify-center">
        <div className="math-grid-square">
          <svg viewBox="0 0 20 20">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              {text}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  function createSolutionSquare(text) {
    return (
      <div className="aspect-square w-full bg-gray-300 flex items-center justify-center">
        <div className="math-grid-square">
          <svg viewBox="0 0 25 25">
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              {text}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  function createBlankSquare(isOnEdge) {
    return (
      <div
        className={`aspect-square w-full ${
          isOnEdge ? "bg-white" : "bg-black"
        } flex items-center justify-center`}
      />
    );
  }

  const grid = [];
  if (game) {
    const squares = getSquares();
    for (let i = 0; i < 7; i += 1) {
      grid[i] = [];
      let gridElement;
      for (let j = 0; j < 7; j += 1) {
        const square = squares.find((s) => s.row === i && s.col === j);
        if (square) {
          switch (square.type) {
            case SquareTypes.ANSWER:
              gridElement = createAnswerSquare();
              break;
            case SquareTypes.OPERATOR:
              gridElement = createOperatorSquare(square.operator);
              break;
            case SquareTypes.SOLUTION:
              gridElement = createSolutionSquare(square.value);
              break;
            default:
              throw new Error(`Unknown square type: ${square.type}`);
          }
        } else {
          gridElement = createBlankSquare(i === 6 || j === 6);
        }
        grid[i].push(gridElement);
      }
    }
  }

  return (
    <>
      <h1>Math Grid</h1>
      {statusMessage && <p>{statusMessage}</p>}
      {game && grid && (
        <div className="flex flex-col w-4/5 min-w-[280px] max-w-2xl aspect-square">
          {grid.map((row) => (
            <div className="flex grow flex-row">{row}</div>
          ))}
        </div>
      )}
    </>
  );
}

export { MathGrid };
