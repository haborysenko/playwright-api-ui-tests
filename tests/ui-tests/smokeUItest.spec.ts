import { test, expect, request } from "@playwright/test";
import { PageManager } from "../../page-objects/pageManager";

test.only("sign up", async ({ page }) => {
  const email = process.env.DEV_USERNAME;
  const password = process.env.DEV_PASSWORD;
  if (!email || !password) {
    throw new Error("Set DEV_USERNAME and DEV_PASSWORD in .env");
  }
  const pageManager = new PageManager(page);
  await pageManager.navigateTo().gotoHome();
  await pageManager.navigateTo().loginPage();
  await pageManager.auth().login(email, password);
  await pageManager.navigateTo().newArticlePage();
  await pageManager
    .article()
    .createNewArticle(
      "New title",
      "New description",
      "Bla bla bla article body.",
      "test, tag1, tag2",
    );
  await pageManager.article().deleteArticle();
});
