import { test } from "./utils/fixtures";
import { faker } from "@faker-js/faker";
import { expectValidationError } from "./utils/ui-expect";
import { config } from "../../config/test-config";

test.describe("Article UI | new article form required-field validation", () => {
  const validTitle = faker.lorem.words(3);
  const validDescription = faker.lorem.sentence();
  const validBody = faker.lorem.paragraph();

  const titleRequiredError = "title can't be blank";
  const descriptionRequiredError = "description can't be blank";
  const bodyRequiredError = "body can't be blank";

  test.beforeEach(async ({ pm }) => {
    await pm.navigateTo().gotoHome();
    await pm.navigateTo().loginPage();
    await pm.auth().login(config.api.userEmail, config.api.userPassword);
    await pm.navigateTo().newArticlePage();
  });

  test("should show validation error when title is empty", async ({ pm }) => {
    await pm.article().fillDescription(validDescription);
    await pm.article().fillBody(validBody);
    await pm.article().submitArticle();

    await expectValidationError(pm.article().validationErrors(), titleRequiredError);
  });

  test("should show validation error when description is empty", async ({ pm }) => {
    await pm.article().fillTitle(validTitle);
    await pm.article().fillBody(validBody);
    await pm.article().submitArticle();

    await expectValidationError(pm.article().validationErrors(), descriptionRequiredError);
  });

  test("should show validation error when body is empty", async ({ pm }) => {
    await pm.article().fillTitle(validTitle);
    await pm.article().fillDescription(validDescription);
    await pm.article().submitArticle();

    await expectValidationError(pm.article().validationErrors(), bodyRequiredError);
  });
});
