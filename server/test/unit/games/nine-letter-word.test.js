import { generate } from "../../../src/games/nine-letter-word.js";

const words = [
  "aaabbbccc", // nine letter words
  "abcabcabc",
  "abc", // matching words
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
        answer: expect.any(Object),
        nineLetterWordShuffled: expect.any(String),
        centralLetter: expect.any(String),
      })
    );
    expect(actual.answer).toMatchObject(
      expect.objectContaining({
        nineLetterWord: expect.any(String),
        list: expect.any(Array),
      })
    );
    expect(actual.answer.list).not.toHaveLength(0);
    expect(actual.answer.nineLetterWord).toHaveLength(9);
    expect(actual.nineLetterWordShuffled).toHaveLength(9);
    expect(actual.centralLetter).toHaveLength(1);
  });

  test("valid elements", () => {
    const actual = generate(words);
    expect(actual.nineLetterWordShuffled).toMatch(/^[a-z]+$/);
    expect(actual.nineLetterWordShuffled).toContain(actual.centralLetter);
    expect(actual.centralLetter).toMatch(/^[a-z]$/);
    expect(actual.answer.list).toHaveLength(4);
  });

  test("correct solutions", () => {
    const actual = generate(words);
    const cl = actual.centralLetter;
    const expectedAnswer = ["aaabbbccc", "abcabcabc", "abc", `${cl}${cl}${cl}`];
    expect(actual.answer.list).toEqual(expectedAnswer);
    expect(
      ["aaabbbccc", "abcabcabc"].includes(actual.answer.nineLetterWord)
    ).toBeTruthy();
  });
});
