/* eslint-disable no-console */

const Level = Object.freeze({
  DEBUG: Symbol("DEBUG"),
  ERROR: Symbol("ERROR"),
  INFO: Symbol("INFO"),
  WARN: Symbol("WARN"),
});
const LEVELS = (
  process.env.LOGGER_LEVELS ||
  process.env.REACT_APP_LOGGER_LEVELS ||
  ""
)
  .split(",")
  .map((level) => Level[level]);
const TIMESTAMP_LOCALE =
  process.env.LOGGER_TIMESTAMP_LOCALE ||
  process.env.REACT_APP_LOGGER_TIMESTAMP_LOCALE ||
  "en-GB";
const SHOW_HEADER =
  (process.env.LOGGER_SHOW_HEADER ||
    process.env.REACT_APP_LOGGER_SHOW_HEADER) === "true";
const COLOR_RESET = "\x1b[0m";
const COLOR_YELLOW = "\x1b[33m";
const COLOR_RED = "\x1b[31m";
const COLOR_BLUE = "\x1b[34m";
const COLOR_WHITE = "\x1b[37m";

const consoleExists = typeof console !== "undefined";
let functionDepth = 0;

function getTimestamp() {
  return new Date().toLocaleString(TIMESTAMP_LOCALE);
}

function getCallingFunction() {
  const depth = 3 + functionDepth;
  try {
    throw new Error("log stack");
  } catch (err) {
    const stackLocations = err.stack
      .split("\n")
      .map((location) => location.trim())
      .filter((location) => location.startsWith("at "));
    return stackLocations[depth];
  }
}

function getArgString(arg) {
  if (arg === null) {
    return "null";
  }
  if (arg === undefined) {
    return "undefined";
  }
  switch (typeof arg) {
    case "string":
      return arg;
    case "object":
      return JSON.stringify(arg);
    case "symbol":
      return arg.description;
    default: // number, boolean, bigint, function
      return arg.toString();
  }
}

function getArgsString(args) {
  return args.map((arg) => getArgString(arg)).join("\n");
}

function getMessage(level, args) {
  let message = "";
  if (SHOW_HEADER) {
    const timestamp = getTimestamp();
    const callingFunction = getCallingFunction();
    message += `${timestamp} ${level.description} ${callingFunction}\n`;
  }
  const argsString = getArgsString(args);
  message += argsString;
  return message;
}

function canLog(level) {
  return consoleExists && LEVELS.includes(level);
}

/**
 * Logs a message at the "DEBUG" log level
 * @param  {...any} args list of objects whose string representations get concatenated into one string
 */
function debug(...args) {
  if (canLog(Level.DEBUG)) {
    const message = getMessage(Level.DEBUG, args);
    console.log(`${COLOR_BLUE}${message}${COLOR_RESET}`);
  }
}

function logError(...args) {
  const message = getMessage(Level.ERROR, args);
  console.log(`${COLOR_RED}${message}${COLOR_RESET}`);
  return message;
}

/**
 * Logs a message at the "ERROR" log level
 * @param  {...any} args list of objects whose string representations get concatenated into one string
 */
function error(...args) {
  if (canLog(Level.ERROR)) {
    logError(args);
  }
}

/**
 * Logs a message at the "INFO" log level
 * @param  {...any} args list of objects whose string representations get concatenated into one string
 */
function info(...args) {
  if (canLog(Level.INFO)) {
    const message = getMessage(Level.INFO, args);
    console.log(`${COLOR_WHITE}${message}${COLOR_RESET}`);
  }
}

/**
 * Logs a message at the "WARN" log level
 * @param  {...any} args list of objects whose string representations get concatenated into one string
 */
function warn(...args) {
  if (canLog(Level.WARN)) {
    const message = getMessage(Level.WARN, args);
    console.log(`${COLOR_YELLOW}${message}${COLOR_RESET}`);
  }
}

/**
 * Logs a message at the "ERROR" log level and throws an error with that message
 * @param  {...any} args list of objects whose string representations get concatenated into one string
 */
function logAndThrowError(...args) {
  if (canLog(Level.ERROR)) {
    functionDepth = 1;
    const message = logError(args);
    functionDepth = 0;
    throw new Error(message);
  }
}

const Logger = {
  debug,
  error,
  info,
  warn,
  logAndThrowError,
};

export { Logger };
