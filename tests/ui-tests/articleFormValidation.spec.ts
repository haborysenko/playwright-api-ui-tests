import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageManager } from "../../page-objects/pageManager";
import { expectValidationError } from "./utils/uiExpect";

test.describe("article form validation", () => {
  const validTitle = faker.lorem.words(3);
  const validDescription = faker.lorem.sentence();
  const validBody = faker.lorem.paragraph();
  const titleRequiredError = "title can't be blank";
  const descriptionRequiredError = "description can't be blank";
  const bodyRequiredError = "body can't be blank";

  test.beforeEach(async ({ page }) => {
    const email = process.env.DEV_USERNAME;
    const password = process.env.DEV_PASSWORD;
    if (!email || !password) {
      throw new Error("Set DEV_USERNAME and DEV_PASSWORD in .env");
    }
    const pm = new PageManager(page);
    await pm.navigateTo().gotoHome();
    await pm.navigateTo().loginPage();
    await pm.auth().login(email, password);
    await pm.navigateTo().newArticlePage();
  });

  test("shows error when title is empty", async ({ page }) => {
    const pm = new PageManager(page);
    await pm.article().fillDescription(validDescription);
    await pm.article().fillBody(validBody);

    await pm.article().submitArticle();

    await expectValidationError(
      pm.article().validationErrors(),
      titleRequiredError,
    );
  });

  test("shows error when description is empty", async ({ page }) => {
    const pm = new PageManager(page);
    await pm.article().fillTitle(validTitle);
    await pm.article().fillBody(validBody);

    await pm.article().submitArticle();

    await expectValidationError(
      pm.article().validationErrors(),
      descriptionRequiredError,
    );
  });

  test("shows error when body is empty", async ({ page }) => {
    const pm = new PageManager(page);
    await pm.article().fillTitle(validTitle);
    await pm.article().fillDescription(validDescription);

    await pm.article().submitArticle();

    await expectValidationError(
      pm.article().validationErrors(),
      bodyRequiredError,
    );
  });
});
