import { randomElement, shuffle } from "../utils/random-utils.js";

const Operator = Object.freeze({
  ADDITION: "+",
  SUBTRACTION: "-",
  MULTIPLICATION: "*",
  DIVISION: "/",
});

function getAnswer() {
  const initialArray = Array.from({ length: 9 }, (_, i) => i + 1);
  const shuffledArray = shuffle(initialArray);
  const answer = [];
  for (let i = 0; i < 3; i += 1) {
    answer[i] = [];
    for (let j = 0; j < 3; j += 1) {
      answer[i].push(shuffledArray[i * 3 + j]);
    }
  }
  return answer;
}

function solveEquation(num1, operator, num2) {
  switch (operator) {
    case Operator.ADDITION:
      return num1 + num2;
    case Operator.SUBTRACTION:
      return num1 - num2;
    case Operator.MULTIPLICATION:
      return num1 * num2;
    case Operator.DIVISION:
      return num1 / num2;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

function getLineOperators(line) {
  const operators = [];

  // First operator
  let firstOperator;
  // The conditions for division are rare, so if they exist then use it.
  // - no division by one
  // - no remainder
  if (line[1] !== 1 && line[0] % line[1] === 0) {
    firstOperator = Operator.DIVISION;
  } else {
    const validFirstOperators = [
      Operator.ADDITION,
      Operator.SUBTRACTION,
      Operator.MULTIPLICATION,
    ];
    firstOperator = randomElement(validFirstOperators);
  }
  operators.push(firstOperator);

  // Second operator
  let secondOperator;
  const firstSolution = solveEquation(line[0], firstOperator, line[1]);
  if (line[2] !== 1 && firstSolution % line[2] === 0) {
    secondOperator = Operator.DIVISION;
  } else {
    const validSecondOperators = [Operator.ADDITION, Operator.SUBTRACTION];

    // Only allow multiplication if result is a 1 or 2-digit number
    const multiplicationCheck = firstSolution * line[2];
    if (multiplicationCheck >= -99 && multiplicationCheck <= 99) {
      validSecondOperators.push(Operator.MULTIPLICATION);
    }

    secondOperator = randomElement(validSecondOperators);
  }
  operators.push(secondOperator);

  return operators;
}

function transpose(matrix) {
  return matrix[0].map((col, index) => matrix.map((row) => row[index]));
}

function generate() {
  const answer = getAnswer();
  const rowOperators = answer.map((row) => getLineOperators(row));
  const rowSolutions = answer.map((row, index) => {
    const firstEquationSolution = solveEquation(
      row[0],
      rowOperators[index][0],
      row[1]
    );
    const solution = solveEquation(
      firstEquationSolution,
      rowOperators[index][1],
      row[2]
    );
    return solution;
  });
  const answerTranspose = transpose(answer);
  const colOperators = answerTranspose.map((col) => getLineOperators(col));
  const colSolutions = answerTranspose.map((col, index) => {
    const firstEquationSolution = solveEquation(
      col[0],
      colOperators[index][0],
      col[1]
    );
    const solution = solveEquation(
      firstEquationSolution,
      colOperators[index][1],
      col[2]
    );
    return solution;
  });
  return {
    answer,
    rowOperators,
    rowSolutions,
    colOperators,
    colSolutions,
  };
}

export { generate };
