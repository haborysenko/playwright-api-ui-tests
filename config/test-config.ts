import { config as dotenvConfig } from "dotenv";

dotenvConfig();

/** Central config used by both API and UI tests */
export const config = {
  api: {
    baseUrl: process.env.API_BASE_URL ?? "https://conduit-api.bondaracademy.com/api",
    userEmail: process.env.USER_EMAIL ?? "",
    userPassword: process.env.USER_PASSWORD ?? "",
  },
  ui: {
    baseURL: process.env.UI_BASE_URL ?? "https://conduit.bondaracademy.com",
  },
};
