import { generate } from "../../../src/games/nine-letter-word.js";

const words = [
  "aaabbbccc", // nine letter word
  "abc", // matching words
  "abcabcabc",
  "aaa",
  "bbb",
  "ccc",
  "aaaa", // non-matching
  "abcd",
  "aa",
  "bc",
];

describe("generate", () => {
  test("expected structure", () => {
    const actual = generate(words);
    expect(actual).toMatchObject(
      expect.objectContaining({
        answer: expect.any(Array),
        nineLetterWord: expect.any(String),
        centralLetter: expect.any(String),
      })
    );
    expect(actual.answer).not.toHaveLength(0);
    expect(actual.nineLetterWord).toHaveLength(9);
    expect(actual.centralLetter).toHaveLength(1);
  });

  test("valid elements", () => {
    const actual = generate(words);
    expect(actual.nineLetterWord).toMatch(/^[a-z]+$/);
    expect(actual.nineLetterWord).toContain(actual.centralLetter);
    expect(actual.centralLetter).toMatch(/^[a-z]$/);
    expect(actual.answer).toHaveLength(4);
  });

  test("correct solutions", () => {
    const actual = generate(words);
    const cl = actual.centralLetter;
    const expectedAnswer = ["aaabbbccc", "abc", "abcabcabc", `${cl}${cl}${cl}`];
    expect(actual.answer).toEqual(expectedAnswer);
  });
});
