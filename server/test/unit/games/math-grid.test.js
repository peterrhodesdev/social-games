import { generate } from "../../../src/games/math-grid.js";

const VALID_ANSWERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const VALID_OPERATORS = ["+", "-", "*", "/"];
const MIN_SOLUTION_VALUE = -99;
const MAX_SOLUTION_VALUE = 99;

function performCalculation(line, operators) {
  const math = (num1, operator, num2) => eval(`${num1} ${operator} ${num2}`); // eslint-disable-line no-eval
  return math(math(line[0], operators[0], line[1]), operators[1], line[2]);
}

describe("generate", () => {
  test("expected structure", () => {
    const actual = generate();
    expect(actual).toMatchObject(
      expect.objectContaining({
        answer: expect.any(Array),
        rowOperators: expect.any(Array),
        rowSolutions: expect.any(Array),
        colOperators: expect.any(Array),
        colSolutions: expect.any(Array),
      })
    );
    expect(actual.answer).toHaveLength(3);
    actual.answer.forEach((element) => expect(element).toHaveLength(3));
    expect(actual.rowOperators).toHaveLength(3);
    actual.rowOperators.forEach((element) => expect(element).toHaveLength(2));
    expect(actual.rowSolutions).toHaveLength(3);
    expect(actual.colOperators).toHaveLength(3);
    actual.colOperators.forEach((element) => expect(element).toHaveLength(2));
    expect(actual.colSolutions).toHaveLength(3);
  });

  test("valid elements", () => {
    const actual = generate();
    expect(actual.answer.flat()).toEqual(expect.arrayContaining(VALID_ANSWERS));
    actual.rowOperators.forEach((row) =>
      row.forEach((element) => {
        expect(VALID_OPERATORS.includes(element)).toBeTruthy();
      })
    );
    actual.rowSolutions.forEach((element) => {
      expect(element).toBeGreaterThanOrEqual(MIN_SOLUTION_VALUE);
      expect(element).toBeLessThanOrEqual(MAX_SOLUTION_VALUE);
    });
    actual.colOperators.forEach((col) =>
      col.forEach((element) => {
        expect(VALID_OPERATORS.includes(element)).toBeTruthy();
      })
    );
    actual.colSolutions.forEach((element) => {
      expect(element).toBeGreaterThanOrEqual(MIN_SOLUTION_VALUE);
      expect(element).toBeLessThanOrEqual(MAX_SOLUTION_VALUE);
    });
  });

  test("correct solutions", () => {
    const actual = generate();
    actual.rowSolutions.forEach((solution, index) => {
      const calculation = performCalculation(
        actual.answer[index],
        actual.rowOperators[index]
      );
      expect(solution).toEqual(calculation);
    });
    actual.colSolutions.forEach((solution, index) => {
      const calculation = performCalculation(
        actual.answer.map((row) => row[index]),
        actual.colOperators[index]
      );
      expect(solution).toEqual(calculation);
    });
  });
});
