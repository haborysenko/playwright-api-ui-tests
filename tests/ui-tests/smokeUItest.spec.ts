import { test, expect, request } from "@playwright/test";

test("createArticle", async ({ page, request }) => {
  const email = process.env.DEV_USERNAME;
  const password = process.env.DEV_PASSWORD;
  if (!email || !password) {
    throw new Error("Set DEV_USERNAME and DEV_PASSWORD in .env");
  }

  await page.goto("/");
  await page.getByText("Sign in").click();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "New Article" }).click();
});
