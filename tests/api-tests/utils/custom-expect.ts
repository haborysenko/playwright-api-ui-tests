import { expect as baseExpect } from "@playwright/test";
import { APILogger } from "./logger";
import { validateSchema } from "./schema-validator";
let apiLogger: APILogger;

export const setCustomExpectLogger = (logger: APILogger) => {
  apiLogger = logger;
};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      shouldEqual(expected: any): R;
      shouldBe(expected: any): R;
      shouldBeLessThanOrEqual(max: number): R;
      shouldMatchSchema(
        dirName: string,
        fileName: string,
        createSchemaFlag?: boolean,
      ): Promise<R>;
    }
  }
}

/**
 * Builds the matcher result (message + pass) for custom assertions.
 * Message includes matcher hint, expected/received, and Recent API Activity (request/response logs)
 * so failures in the test report show the last API call.
 *
 * @example
 * // In a custom matcher (e.g. shouldBe):
 * try {
 *   baseExpect(received).toBe(expected);
 *   pass = true;
 *   if (this.isNot) logs = apiLogger.getRecentLogs();
 * } catch {
 *   logs = apiLogger.getRecentLogs();
 * }
 * return withApiLogs(this, "shouldBe", pass, received, expected, logs);
 */
function withApiLogs(
  ctx: { utils: any; isNot?: boolean },
  name: string,
  pass: boolean,
  received: any,
  expected: any,
  logs: string,
) {
  const hint = ctx.isNot ? "not " : "";
  const message =
    ctx.utils.matcherHint(name, undefined, undefined, { isNot: ctx.isNot }) +
    "\n\n" +
    `Expected: ${hint} ${ctx.utils.printExpected(expected)}\n` +
    `Received: ${ctx.utils.printReceived(received)}\n\n` +
    `Recent API Activity:\n${logs}`;
  return { message: () => message, pass };
}

export const expect = baseExpect.extend({
  async shouldMatchSchema(
    received: any,
    dirName: string,
    fileName: string,
    createSchemaFlag: boolean = false, // default to true to generate schema from all responses
  ) {
    let pass: boolean;
    let message: string = "";

    try {
      await validateSchema(dirName, fileName, received, createSchemaFlag);
      pass = true;
      message = `Schema validation ${fileName}_schema.json passed`;
    } catch (e: any) {
      pass = false;
      const logs = apiLogger.getRecentLogs();
      message = `${e.message}\n\nRecent API Activity:\n${logs}`;
    }
    return { message: () => message, pass };
  },

  shouldEqual(received: any, expected: any) {
    let pass = false;
    let logs = "";
    try {
      baseExpect(received).toEqual(expected);
      pass = true;
      if (this.isNot) logs = apiLogger.getRecentLogs();
    } catch {
      logs = apiLogger.getRecentLogs();
    }
    return withApiLogs(this, "shouldEqual", pass, received, expected, logs);
  },

  shouldBe(received: any, expected: any) {
    let pass = false;
    let logs = "";
    try {
      baseExpect(received).toBe(expected);
      pass = true;
      if (this.isNot) logs = apiLogger.getRecentLogs();
    } catch {
      logs = apiLogger.getRecentLogs();
    }
    return withApiLogs(this, "shouldBe", pass, received, expected, logs);
  },

  shouldBeLessThanOrEqual(received: any, max: number) {
    let pass = false;
    let logs = "";
    try {
      baseExpect(received).toBeLessThanOrEqual(max);
      pass = true;
      if (this.isNot) logs = apiLogger.getRecentLogs();
    } catch {
      logs = apiLogger.getRecentLogs();
    }
    return withApiLogs(
      this,
      "shouldBeLessThanOrEqual",
      pass,
      received,
      max,
      logs,
    );
  },
});
