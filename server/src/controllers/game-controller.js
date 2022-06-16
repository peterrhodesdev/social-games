import express from "express";
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
      console.error(`Unknown game: ${req.params.game}`);
      return res.status(404).send("Not found.");
  }
  console.log(`${req.params.game}: ${JSON.stringify(game)}`);
  return res.json(game);
});

export { router };
