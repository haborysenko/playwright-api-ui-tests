import { test } from "./utils/fixtures";
import { expect } from "./utils/custom-expect";
import { getNewRandomArticle } from "./utils/data-generator";

test.describe("Article API | list and full CRUD", () => {
  test("should return paginated list of articles limited to 10", async ({ api }) => {
    const response = await api
      .path("/articles")
      .params({ limit: 10, offset: 0 })
      .getRequest(200);

    await expect(response).shouldMatchSchema("articles", "GET_article_schema", false);
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
  });

  test("should create, read, update, re-read, delete and confirm 404", async ({ api }) => {
    const articleRequest = getNewRandomArticle();
    let slug: string;
    let newSlug: string;

    await test.step("Create article", async () => {
      const response = await api
        .path("/articles")
        .body(articleRequest)
        .postRequest(201);
      await expect(response).shouldMatchSchema("articles", "POST_article_schema", false);
      expect(response.article.title).shouldBe(articleRequest.article.title);
      slug = response.article.slug;
    });

    await test.step("Read article by slug", async () => {
      const response = await api.path(`/articles/${slug}`).getRequest(200);
      await expect(response).shouldMatchSchema("articles", "GET_article_by_slug_schema", false);
      expect(response.article.title).shouldBe(articleRequest.article.title);
    });

    await test.step("Update article", async () => {
      const response = await api
        .path(`/articles/${slug}`)
        .body(articleRequest)
        .putRequest(200);
      await expect(response).shouldMatchSchema("articles", "PUT_article_schema", false);
      expect(response.article.title).shouldBe(articleRequest.article.title);
      newSlug = response.article.slug;
    });

    await test.step("Read article after update", async () => {
      const response = await api.path(`/articles/${newSlug}`).getRequest(200);
      await expect(response).shouldMatchSchema("articles", "GET_article_by_slug_schema", false);
      expect(response.article.title).shouldBe(articleRequest.article.title);
    });

    await test.step("Delete article and verify 404", async () => {
      await api.path(`/articles/${newSlug}`).deleteRequest(204);
      // GET deleted article returns 404 (body shape may vary: .error, .message, or .errors)
      await api.path(`/articles/${newSlug}`).getRequest(404);
    });
  });
});
