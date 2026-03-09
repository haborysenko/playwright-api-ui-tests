import { test } from "./utils/fixtures";
import { faker } from "@faker-js/faker";
import { config } from "../../config/test-config";

test.describe("Article UI | create and delete flow", () => {
  const articleData = {
    initialTitle: faker.lorem.words(3),
    initialDescription: faker.lorem.sentence(),
    initialBody: faker.lorem.paragraph(),
    initialTag: faker.lorem.word(),
  };

  test.beforeEach(async ({ pm }) => {
    await pm.navigateTo().gotoHome();
    await pm.navigateTo().loginPage();
    await pm.auth().login(config.api.userEmail, config.api.userPassword);
  });

  test("should create article, then delete it via UI", async ({ pm }) => {
    await test.step("Create article", async () => {
      await pm.navigateTo().newArticlePage();
      await pm
        .article()
        .createArticle(
          articleData.initialTitle,
          articleData.initialDescription,
          articleData.initialBody,
          articleData.initialTag,
        );
    });

    await test.step("Verify all fields after create", async () => {
      await pm.article().openEditForm();
      await pm.article().expectEditArticleFormValues({
        title: articleData.initialTitle,
        description: articleData.initialDescription,
        body: articleData.initialBody,
        tag: articleData.initialTag,
      });
      await pm.article().goBack();
      await pm.article().expectArticlePageValues({
        title: articleData.initialTitle,
        body: articleData.initialBody,
        tag: articleData.initialTag,
      });
    });

    await test.step("Delete article", async () => {
      await pm.article().deleteArticle();
    });
  });
});
