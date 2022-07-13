import React from "react";
import { MathGrid } from "./components/games/math-grid/MathGrid";
import { NineLetterWord } from "./components/games/nine-letter-word/NineLetterWord";

const games = [
  {
    name: "math-grid",
    displayName: "Math Grid",
    component: (props) => <MathGrid {...props} />,
    description:
      "Complete the grid using the numbers from 1 to 9 so that the equations are all correct.",
    rules: [
      "Each number from 1 to 9 must be used once.",
      "The equations are solved from left to right and top to bottom (i.e. the normal order of operations is ignored).",
      "The result of a division will be a whole number.",
      "There is no division by one.",
    ],
    controls: [
      "Click on the grid square you wish to solve to highlight it.",
      "Clicking a number from 1 to 9 will add/remove that number to/from the highlighted square.",
      "Click the notes icon to enable/disable pencil marks (this allows you enter more than one number in the square).",
      `Once all squares are filled in with a single number click "Submit" to check your solution. If it is correct the game will end, otherwise you can fix any mistakes and resubmit.`,
    ],
    images: [
      {
        src: "math-grid-initial.png",
        alt: "Math Grid Initial",
        label: "Game start",
      },
      {
        src: "math-grid-final.png",
        alt: "Math Grid Final",
        label: "Game completed",
      },
    ],
  },
  {
    name: "nine-letter-word",
    displayName: "Nine Letter Word",
    component: (props) => <NineLetterWord {...props} />,
    description: "Create as many words as possible using the letters given.",
    rules: [
      "The central letter must always be included.",
      "Words must have at least 3 letters.",
      "Each letter can only be used once.",
    ],
    controls: [
      "Enter a word by typing in the text box or clicking on the letters.",
      <span>
        Click &quot;Guess&quot; to enter the word and see if it is correct or
        incorrect (words are checked against the{" "}
        <a
          href="https://github.com/wordnik/wordlist"
          target="_blank"
          rel="noreferrer"
        >
          Wordnik Wordlist
        </a>
        ).
      </span>,
      `When you can't think of any more words click "Submit" to end the game and see how many words you found out of all the possibilities.`,
    ],
    images: [
      {
        src: "nine-letter-word-initial.png",
        alt: "Nine Letter Word Initial",
        label: "Game start",
      },
      {
        src: "nine-letter-word-final.png",
        alt: "Nine Letter Word Final",
        label: "Correctly guessed word",
      },
    ],
  },
];

function getGames() {
  return games;
}

function getGameByName(name) {
  return games.find((game) => game.name === name);
}

export { getGameByName, getGames };
