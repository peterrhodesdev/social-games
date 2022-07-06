import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as http from "http";
import { Server } from "socket.io";
import { Logger } from "shared";
import { socketNamespace as lobbySocket } from "./sockets/lobby-socket.js";
import { socketNamespace as mathGridSocket } from "./sockets/math-grid-socket.js";
import { socketNamespace as nineLetterWordSocket } from "./sockets/nine-letter-word-socket.js";

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = dirname(__filename); // eslint-disable-line no-underscore-dangle
const { PORT } = process.env;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`http://localhost:${PORT}`],
    methods: ["GET"],
  },
});

// Socket namespaces
lobbySocket(io.of("/lobby"));
mathGridSocket(io.of("/game/math-grid"));
nineLetterWordSocket(io.of("/game/nine-letter-word"));

// Serve file from built React app
app.use(express.static(path.resolve(__dirname, "../../client/build")));

// Log every request
app.use((req, res, next) => {
  Logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

// All GET requests not handled before will return the client React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
});

server.listen(PORT, () => {
  Logger.info(`server listening on port ${PORT}`);
});
