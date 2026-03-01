import { test } from "./utils/fixtures";
import { expect } from "./utils/custom-expect";
import articleRequestPayloads from "../../request-objects/POST-article.json";
import { faker } from "@faker-js/faker";
import { getNewRandomArticle } from "./utils/data-generator";

test("should get articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({
      limit: 10,
      offset: 0,
    })
    .getRequest(200);
  await expect(response).shouldMatchSchema(
    "articles",
    "GET_article_schema",
    false,
  );
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
});

test("create, update and delete article", async ({ api }) => {
  const articleRequest = getNewRandomArticle();
  const createArticleResponse = await api
    .path("/articles")
    .body(articleRequest)
    .postRequest(201);
  await expect(createArticleResponse).shouldMatchSchema(
    "articles",
    "POST_article_schema",
    false,
  );
  expect(createArticleResponse.article.title).shouldEqual(
    articleRequest.article.title,
  );

  const slug = createArticleResponse.article.slug;

  const getArticleResponseAfterCreate = await api
    .path(`/articles/${slug}`)
    .getRequest(200);
  await expect(getArticleResponseAfterCreate).shouldMatchSchema(
    "articles",
    "GET_article_by_slug_schema",
    false,
  );
  expect(getArticleResponseAfterCreate.article.title).shouldBe(
    articleRequest.article.title,
  );

  const updateArticleResponse = await api
    .path(`/articles/${slug}`)
    .body(articleRequest)
    .putRequest(200);
  await expect(updateArticleResponse).shouldMatchSchema(
    "articles",
    "PUT_article_schema",
    false,
  );
  expect(updateArticleResponse.article.title).shouldBe(
    articleRequest.article.title,
  );

  const newSlug = updateArticleResponse.article.slug;

  const getArticleResponseAfterUpdate = await api
    .path(`/articles/${newSlug}`)
    .getRequest(200);
  await expect(getArticleResponseAfterUpdate).shouldMatchSchema(
    "articles",
    "GET_article_by_slug_schema",
    false,
  );
  expect(getArticleResponseAfterUpdate.article.title).shouldBe(
    articleRequest.article.title,
  );

  await api.path(`/articles/${newSlug}`).deleteRequest(204);

  // GET deleted article returns 404 (body shape may vary: .error, .message, or .errors)
  await api.path(`/articles/${slug}`).getRequest(404);
});
