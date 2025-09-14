import winston from "winston";
import "winston-daily-rotate-file";

export class Logger {
  private transport: winston.transport;

  /**
   * Creates a new Logger instance with a default transport for logging errors
   * to a daily rotating log file.
   *
   * @remarks
   * The log file will be rotated every day and will be zipped and kept for up
   * to 14 days. Each log file will have a maximum size of 1MB before it is
   * rotated.
   */
  constructor() {
    this.transport = new winston.transports.DailyRotateFile({
      filename: "./logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "1m",
      maxFiles: "14d",
      level: "error",
      handleExceptions: true,
    });
  }
  /**
   * Returns a winston Logger instance with the default transport set to the
   * daily rotating log file transport created by the constructor.
   *
   * @remarks
   * The returned logger has a log level of "silly" and its format is set to
   * include timestamps, error stack traces, labels (set to "[LOGGER]") and
   * formatted log messages.
   *
   * @returns {winston.Logger} A winston Logger instance.
   */
  setLogger(): winston.Logger {
    return winston.createLogger({
      level: "silly",
      format: winston.format.combine(
        winston.format.errors({ space: 2 }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS A" }),
        winston.format.label({ label: "[LOGGER]" }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
      transports: [this.transport],
    });
  }
}

const Log = new Logger().setLogger();

export default Log;
