import { test, expect } from "./utils/fixtures";
import { faker } from "@faker-js/faker";
import { config } from "../../config/test-config";

test.describe("Article UI | full CRUD flow (create, update, delete)", () => {
  const articleData = {
    initialTitle: faker.lorem.words(3),
    updatedTitle: faker.lorem.words(3),
    initialDescription: faker.lorem.sentence(),
    updatedDescription: faker.lorem.sentence(),
    initialBody: faker.lorem.paragraph(),
    updatedBody: faker.lorem.paragraph(),
    initialTag: faker.lorem.word(),
    updatedTag: faker.lorem.word(),
  };

  test.beforeEach(async ({ pm }) => {
    await pm.navigateTo().gotoHome();
    await pm.navigateTo().loginPage();
    await pm.auth().login(config.api.userEmail, config.api.userPassword);
  });

  test("should create article, then update it, then delete it via UI", async ({ pm, page }) => {
    await pm.navigateTo().newArticlePage();
    await pm
      .article()
      .createArticle(
        articleData.initialTitle,
        articleData.initialDescription,
        articleData.initialBody,
        articleData.initialTag,
      );

    await pm
      .article()
      .updateArticle(
        articleData.updatedTitle,
        articleData.updatedDescription,
        articleData.updatedBody,
        articleData.updatedTag,
      );

    await expect(
      page.getByRole("heading", { name: articleData.updatedTitle }),
    ).toBeVisible();

    await pm.article().deleteArticle();
  });
});
