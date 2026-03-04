import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageManager } from "../../page-objects/pageManager";

test.describe("article smoke tests", () => {
  const createArticleData = {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    tag: faker.lorem.word(),
  };

  const updateArticleData = {
    initialTitle: faker.lorem.words(3),
    updatedTitle: faker.lorem.words(3),
    initialDescription: faker.lorem.sentence(),
    updatedDescription: faker.lorem.sentence(),
    initialBody: faker.lorem.paragraph(),
    updatedBody: faker.lorem.paragraph(),
    initialTag: faker.lorem.word(),
    updatedTag: faker.lorem.word(),
  };
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
  });

  test("create, update and delete article", async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo().newArticlePage();
    await pm
      .article()
      .createArticle(
        updateArticleData.initialTitle,
        updateArticleData.initialDescription,
        updateArticleData.initialBody,
        updateArticleData.initialTag,
      );

    await pm
      .article()
      .updateArticle(
        updateArticleData.updatedTitle,
        updateArticleData.updatedDescription,
        updateArticleData.updatedBody,
        updateArticleData.updatedTag,
      );

    await expect(
      page.getByRole("heading", { name: updateArticleData.updatedTitle }),
    ).toBeVisible();

    await pm.article().deleteArticle();
  });
});
