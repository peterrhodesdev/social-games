const GameStage = Object.freeze({
  IN_PROGRESS: Symbol("inProgress"),
  SUBMITTED: Symbol("submitted"),
  FINISHED: Symbol("finished"),
});

export { GameStage };
