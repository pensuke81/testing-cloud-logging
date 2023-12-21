//@ts-check
const winston = require("winston");

// Imports the Google Cloud client library for Winston
const { LoggingWinston } = require("@google-cloud/logging-winston");

const levels = {
  emerg: 0,
  alert: 1,
  error: 3,
  warn: 4,
  notice: 5,
  info: 6,
  debug: 7,
};

const loggingWinston = new LoggingWinston({
  // logName: "stdout",
  levels,
});

// Create a Winston logger that streams to Cloud Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
const logger = winston.createLogger({
  // levels: winston.config.syslog.levels,
  levels,
  level: "debug",
  defaultMeta: {
    logName: `projects/${
      process.env.PROJECT_ID ?? "project-id"
    }/logs/test-custom-log-name`,
    labels: { route_to: "bigquery" },
  },
  format: winston.format.combine(winston.format.json()),
  transports: [
    new winston.transports.Console(),
    // Add Cloud Logging
    loggingWinston,
  ],
});

// logger.info("test log: info");
try {
  throw new Error("error1");
} catch (error) {
  logger.error("test log: info", new Error("test error", { cause: error }));
}

// logger.alert("test log: alert");
// logger.error("test log: error");
// logger.warn("test log: warn");
// logger.notice("test log: notice");
// logger.info("test log: info");
// logger.debug("test log: debug");
