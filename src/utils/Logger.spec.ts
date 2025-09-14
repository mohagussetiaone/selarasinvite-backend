import { describe, expect, it } from "bun:test";
import Log, { Logger } from "./Logger";

describe("Logger Test", () => {
  it("should create a logger", async () => {
    const logger = new Logger();
    expect(logger).toBeInstanceOf(Logger);
  });

  it("should log an error", async () => {
    const logger = new Logger().setLogger();
    logger.error("Error message");
  });

  it("should log an info message", async () => {
    Log.info("Info message");
  });
});
