import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { PageManager } from "../../page-objects/page-manager";
import { createToken } from "../api-tests/helpers/create-token";
import { RequestHandler } from "../api-tests/utils/request-handler";
import { APILogger } from "../api-tests/utils/logger";
import { config } from "../../config/test-config";

test.describe("Article UI | hybrid API setup and UI interaction", () => {
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
    authToken = await createToken(config.api.userEmail, config.api.userPassword);
    const api = new RequestHandler(request, config.api.baseUrl, new APILogger(), authToken);

    const createArticleResponse = await api
      .path("/articles")
      .body({
        article: {
          title: articleData.title,
          description: articleData.description,
          body: articleData.body,
        },
      })
      .postRequest(201);

    articleSlug = createArticleResponse.article.slug;
  });

  test.beforeEach("log in and navigate to article via UI", async ({ page }) => {
    const pm = new PageManager(page);
    await pm.navigateTo().gotoHome();
    await pm.navigateTo().loginPage();
    await pm.auth().login(config.api.userEmail, config.api.userPassword);
    await page.goto(`/article/${articleSlug}`);
  });

  test.afterEach("delete article via API", async ({ request }) => {
    const api = new RequestHandler(request, config.api.baseUrl, new APILogger(), authToken);
    await api.path(`/articles/${articleSlug}`).deleteRequest(204);
  });

  test("should update article title and body via UI", async ({ page }) => {
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
