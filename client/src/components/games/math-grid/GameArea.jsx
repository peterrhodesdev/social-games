import React from "react";
import { AnswerSquare } from "./AnswerSquare";
import { BlankSquare } from "./BlankSquare";
import { OperatorSquare } from "./OperatorSquare";
import { SolutionSquare } from "./SolutionSquare";
import { GameStage } from "./GameStage";

const SquareTypes = Object.freeze({
  ANSWER: Symbol("answer"),
  OPERATOR: Symbol("operator"),
  SOLUTION: Symbol("solution"),
});

function GameArea({
  game,
  answerSquareClickHandler,
  activeAnswerSquare,
  gameState,
  gameStage,
}) {
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

  function createAnswerSquare(row, col) {
    const answerSquareState = gameState.find(
      (element) => element.row === row && element.col === col
    );
    return (
      <AnswerSquare
        clickHandler={() => answerSquareClickHandler(row, col)}
        value={answerSquareState.value}
        isActive={
          activeAnswerSquare.row === row && activeAnswerSquare.col === col
        }
        notesValues={answerSquareState.notesValues}
      />
    );
  }

  let blankSquareBackgroundColor;
  switch (gameStage) {
    case GameStage.ANSWER_CORRECT:
      blankSquareBackgroundColor = "bg-green-500";
      break;
    case GameStage.ANSWER_INCORRECT:
      blankSquareBackgroundColor = "bg-red-500";
      break;
    default:
      blankSquareBackgroundColor = "bg-white";
  }

  const grid = [];
  const squares = getSquares();
  for (let i = 0; i < 7; i += 1) {
    grid[i] = [];
    let gridElement;
    for (let j = 0; j < 7; j += 1) {
      const square = squares.find((s) => s.row === i && s.col === j);
      if (square) {
        switch (square.type) {
          case SquareTypes.ANSWER:
            gridElement = createAnswerSquare(i / 2, j / 2);
            break;
          case SquareTypes.OPERATOR:
            gridElement = <OperatorSquare operator={square.operator} />;
            break;
          case SquareTypes.SOLUTION:
            gridElement = <SolutionSquare solution={square.value} />;
            break;
          default:
            throw new Error(`Unknown square type: ${square.type}`);
        }
      } else {
        gridElement = (
          <BlankSquare
            isOnEdge={i === 6 || j === 6}
            backgroundColor={blankSquareBackgroundColor}
          />
        );
      }
      grid[i].push(gridElement);
    }
  }

  return (
    <div className="flex flex-col aspect-square border border-black">
      {grid.map((row) => (
        <div className="flex flex-row">{row}</div>
      ))}
    </div>
  );
}

export { GameArea };
