import { expect } from "@playwright/test";
import { test as baseApiTest } from "../api-tests/utils/fixtures";
import { faker } from "@faker-js/faker";
import { PageManager } from "../../support/ui/page-objects/page-manager";

// This spec combines API infrastructure (auth token, RequestHandler) with UI page interactions
const test = baseApiTest.extend<{ pm: PageManager }>({
  pm: async ({ page }, use) => await use(new PageManager(page)),
});

test.describe("Article UI | update article (API setup and teardown)", () => {
  const articleData = {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
  };

  const updatedDescription = faker.lorem.sentence();
  const updatedBody = faker.lorem.paragraph();
  const updatedTag = faker.lorem.word();

  let articleSlug: string;

  test.beforeEach("create article via API", async ({ api }) => {
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

  test.beforeEach("log in and navigate to article via UI", async ({ pm, page, config }) => {
    await pm.navigateTo().gotoHome();
    await pm.navigateTo().loginPage();
    await pm.auth().login(config.api.userEmail, config.api.userPassword);
    await page.goto(`/article/${articleSlug}`);
  });

  test.afterEach("delete article via API", async ({ api }) => {
    await api.path(`/articles/${articleSlug}`).deleteRequest(204);
  });

  test("should update article description and body via UI when article was created via API", async ({ pm, page }) => {
    // Update only description/body/tag so slug stays the same and afterEach delete works
    await pm
      .article()
      .updateArticle(
        articleData.title,
        updatedDescription,
        updatedBody,
        updatedTag,
      );

    await expect(
      page.getByRole("heading", { name: articleData.title }),
    ).toBeVisible();
    await expect(page.getByText(updatedBody)).toBeVisible();
  });
});
