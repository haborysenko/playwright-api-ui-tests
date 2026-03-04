import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageManager } from "../../page-objects/pageManager";
import { expectValidationError } from "./utils/uiExpect";
import { config } from "../../config/test-config";

test.describe("Article UI | form validation", () => {
  const validTitle = faker.lorem.words(3);
  const validDescription = faker.lorem.sentence();
  const validBody = faker.lorem.paragraph();

  const titleRequiredError = "title can't be blank";
  const descriptionRequiredError = "description can't be blank";
  const bodyRequiredError = "body can't be blank";

  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo().gotoHome();
    await pm.navigateTo().loginPage();
    await pm.auth().login(config.api.userEmail, config.api.userPassword);
    await pm.navigateTo().newArticlePage();
  });

  test("should show error when title is empty", async ({ page }) => {
    const pm = new PageManager(page);
    await pm.article().fillDescription(validDescription);
    await pm.article().fillBody(validBody);
    await pm.article().submitArticle();

    await expectValidationError(pm.article().validationErrors(), titleRequiredError);
  });

  test("should show error when description is empty", async ({ page }) => {
    const pm = new PageManager(page);
    await pm.article().fillTitle(validTitle);
    await pm.article().fillBody(validBody);
    await pm.article().submitArticle();

    await expectValidationError(pm.article().validationErrors(), descriptionRequiredError);
  });

  test("should show error when body is empty", async ({ page }) => {
    const pm = new PageManager(page);
    await pm.article().fillTitle(validTitle);
    await pm.article().fillDescription(validDescription);
    await pm.article().submitArticle();

    await expectValidationError(pm.article().validationErrors(), bodyRequiredError);
  });
});
