import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageManager } from "../../page-objects/pageManager";
import { createToken } from "../api-tests/helpers/createToken";
import { config } from "../../config/test-config";

test.describe("update article via UI (API setup/teardown)", () => {
  const apiBaseUrl = config.api.baseUrl;

  const articleData = {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
  };

  const updatedArticleData = {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    tag: faker.lorem.word(),
  };

  let authToken: string;
  let articleSlug: string;

  test.beforeEach("create article via API", async ({ request }) => {
    const email = process.env.DEV_USERNAME;
    const password = process.env.DEV_PASSWORD;
    if (!email || !password) {
      throw new Error("Set DEV_USERNAME and DEV_PASSWORD in .env");
    }

    authToken = await createToken(email, password);

    const response = await request.post(`${apiBaseUrl}/articles`, {
      headers: { Authorization: authToken },
      data: {
        article: {
          title: articleData.title,
          description: articleData.description,
          body: articleData.body,
        },
      },
    });

    const body = await response.json();
    articleSlug = body.article.slug;
  });

  test.beforeEach("login and open article edit page via UI", async ({ page }) => {
    const email = process.env.DEV_USERNAME;
    const password = process.env.DEV_PASSWORD;

    const pm = new PageManager(page);
    await pm.navigateTo().gotoHome();
    await pm.navigateTo().loginPage();
    await pm.auth().login(email!, password!);
    await page.goto(`/article/${articleSlug}`);
  });

  test.afterEach("delete article via API", async ({ request }) => {
    await request.delete(`${apiBaseUrl}/articles/${articleSlug}`, {
      headers: { Authorization: authToken },
    });
  });

  test("update article via UI", async ({ page }) => {
    const pm = new PageManager(page);

    await pm
      .article()
      .updateArticle(
        updatedArticleData.title,
        updatedArticleData.description,
        updatedArticleData.body,
        updatedArticleData.tag,
      );

    await expect(
      page.getByRole("heading", { name: updatedArticleData.title }),
    ).toBeVisible();
  });
});
