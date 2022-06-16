import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Logger } from "shared";
import { router as gameRouter } from "./controllers/game-controller.js";

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = dirname(__filename); // eslint-disable-line no-underscore-dangle
const app = express();
const { PORT } = process.env;

// Serve file from built React app
app.use(express.static(path.resolve(__dirname, "../../client/build")));

// Log every request
app.use((req, res, next) => {
  Logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

// API routes
app.use("/api/game", gameRouter);

// All GET requests not handled before will return the client React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
});

app.listen(PORT, () => {
  Logger.info(`server listening on port ${PORT}`);
});
