import { test as base } from "@playwright/test";
import { RequestHandler } from "./request-handler";
import { APILogger } from "./logger";
import { setCustomExpectLogger } from "./custom-expect";
import { config } from "../../../config/test-config";
import { createToken } from "../helpers/create-token";

export type TestOptions = {
  api: RequestHandler;
  config: typeof config;
  attachApiLogs: void; // auto fixture – no value, runs after every test
};

export type WorkerFixture = {
  authToken: string;
};
export const test = base.extend<TestOptions, WorkerFixture>({
  authToken: [
    async ({}, use) => {
      const authToken = await createToken(
        config.api.userEmail,
        config.api.userPassword,
      );
      await use(authToken);
    },
    { scope: "worker" },
  ],

  api: async ({ request, authToken }, use) => {
    const logger = new APILogger();
    setCustomExpectLogger(logger);
    const requestHandler = new RequestHandler(
      request,
      config.api.baseUrl,
      logger,
      authToken,
    );
    await use(requestHandler);
  },

  attachApiLogs: [
    async ({ api }, use, testInfo) => {
      await use();
      const logs = api.getRecentLogs();
      if (logs)
        await testInfo.attach("API request/response", {
          body: logs,
          contentType: "text/plain",
        });
    },
    { auto: true },
  ],
  config: async ({}, use) => {
    await use(config);
  },
});
