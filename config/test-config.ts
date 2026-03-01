import dotenv from "dotenv";
import path from "path";

// Load .env from project root (API tests, helpers, etc. import config before playwright runs)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const processEnv = process.env.TEST_ENV;
const env = processEnv || "dev";

/** Test environment: dev | qa | prod */
export const testEnv = env;

/** Central config used by both API and UI tests */
export const config = {
  api: {
    baseUrl: "https://conduit-api.bondaracademy.com/api",
    /** Email (DEV_USERNAME, QA_USERNAME, or PROD_USERNAME depending on TEST_ENV) */
    userEmail: "",
    /** Password (DEV_PASSWORD, QA_PASSWORD, or PROD_PASSWORD depending on TEST_ENV) */
    userPassword: "",
  },
  ui: {
    baseURL: "https://conduit.bondaracademy.com",
  },
};

// Resolve credentials by environment
if (env === "qa") {
  config.api.userEmail = process.env.QA_USERNAME ?? "";
  config.api.userPassword = process.env.QA_PASSWORD ?? "";
} else if (env === "prod") {
  config.api.userEmail = process.env.PROD_USERNAME ?? "";
  config.api.userPassword = process.env.PROD_PASSWORD ?? "";
} else {
  config.api.userEmail = process.env.DEV_USERNAME ?? "";
  config.api.userPassword = process.env.DEV_PASSWORD ?? "";
}

if (process.env.CI !== "true") {
  console.log("Test environment is:", env);
}
