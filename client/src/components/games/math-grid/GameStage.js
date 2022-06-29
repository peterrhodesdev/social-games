const GameStage = Object.freeze({
  IN_PROGRESS: Symbol("inProgress"),
  CHECKING_ANSWER: Symbol("checkingAnswer"),
  ANSWER_CORRECT: Symbol("answerCorrect"),
  ANSWER_INCORRECT: Symbol("answerIncorrect"),
});

export { GameStage };
