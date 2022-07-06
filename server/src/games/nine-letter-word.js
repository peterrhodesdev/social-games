import { randomElement } from "../utils/random-utils.js";

function chooseNineLetterWord(words) {
  const nineLetterWords = words.filter((word) => word.length === 9);
  return randomElement(nineLetterWords);
}

function chooseCentralLetter(nineLetterWord) {
  return randomElement(nineLetterWord);
}

function countCharOccurrences(char, str) {
  return (str.match(new RegExp(char, "g")) || []).length;
}

function buildAnswer(words, nineLetterWord, centralLetter) {
  return words.filter(
    (word) =>
      word.length >= 3 &&
      word.length <= 9 &&
      word.includes(centralLetter) &&
      [...word].every(
        (letter) =>
          countCharOccurrences(letter, nineLetterWord) >=
          countCharOccurrences(letter, word)
      )
  );
}

function generate(words) {
  const nineLetterWord = chooseNineLetterWord(words);
  const centralLetter = chooseCentralLetter(nineLetterWord);
  const answer = buildAnswer(words, nineLetterWord, centralLetter);
  return { nineLetterWord, centralLetter, answer };
}

export { generate };
