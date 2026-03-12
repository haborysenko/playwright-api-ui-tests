import { test as baseApiTest } from "../api-tests/utils/fixtures";
import { faker } from "@faker-js/faker";
import { PageManager } from "../../support/ui/page-objects/page-manager";

// Extends the API fixture set (which provides `api`, `config`, and a worker-scoped `authToken`)
// with the `pm` (PageManager) UI fixture. This gives the test access to both layers:
// API fixtures handle setup/teardown (create and delete the article), while
// PageManager drives the browser for the actual UI interaction being tested.
const test = baseApiTest.extend<{ pm: PageManager }>({
  pm: async ({ page }, use) => await use(new PageManager(page)),
});

test.describe("Article UI | update article body field with API setup and teardown", () => {
  const articleData = {
    initialTitle: faker.lorem.words(3),
    initialDescription: faker.lorem.sentence(),
    initialBody: faker.lorem.paragraph(),
  };

  const updatedBody = faker.lorem.paragraph();

  let articleSlug: string;

  test.beforeEach("create article via API", async ({ api }) => {
    const createArticleResponse = await api
      .path("/articles")
      .body({
        article: {
          title: articleData.initialTitle,
          description: articleData.initialDescription,
          body: articleData.initialBody,
        },
      })
      .postRequest(201);

    articleSlug = createArticleResponse.article.slug;
  });

  test.beforeEach(
    "log in and navigate to article via UI",
    async ({ pm, page, config }) => {
      await pm.navigateTo().gotoHome();
      await pm.navigateTo().loginPage();
      await pm.auth().login(config.api.userEmail, config.api.userPassword);
      await page.goto(`/article/${articleSlug}`);
    },
  );

  test.afterEach("delete article via API", async ({ api }) => {
    await api.path(`/articles/${articleSlug}`).deleteRequest(204);
  });

  test("should update article body field and verify the updated value", async ({
    pm,
  }) => {
    await pm.article().updateArticle({ body: updatedBody });
    await pm.article().expectArticlePageValues({ body: updatedBody });
  });
});
