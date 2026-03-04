import { defineConfig } from "@playwright/test";
import { config } from "./config/test-config";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // tests withing the spec file executed sequentially in order they are in file
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1, // ci run with 1 worker, local run with 1 workers
  reporter: [["html"], ["list"]],
  use: {
    baseURL: config.ui.baseURL,
    trace: "retain-on-failure", // to debug failed tests
  },

  // the way how you can organize your tests, separate api and ui tests into different projects
  projects: [
    {
      name: "api-testing",
      testDir: "./tests/api-tests",
    },
    // {
    //   name: "api-testing-smoke",
    //   testDir: "./tests/api-tests",
    //   testMatch: "smoke*",
    // },
    {
      name: "ui-testing",
      testDir: "./tests/ui-tests",
      use: {
        defaultBrowserType: "chromium",
        headless: false, // browser visible when running UI tests (override with --headed=false for headless)
      },
    },
  ],
});
