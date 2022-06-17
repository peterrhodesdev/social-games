import express from "express";
import { Logger } from "shared";
import { generate as generateMathGrid } from "../games/math-grid.js";

const router = express.Router();

// Generate new random game
router.get("/:game", (req, res) => {
  let game;
  switch (req.params.game) {
    case "math-grid":
      game = generateMathGrid();
      break;
    default:
      Logger.error(`Unknown game: ${req.params.game}`);
      return res.status(404).send("Not found.");
  }
  Logger.debug(req.params.game, game);
  return res.json(game);
});

export { router };
