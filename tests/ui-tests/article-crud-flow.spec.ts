import { test } from "./utils/fixtures";
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

  test("should create article, then update it, then delete it via UI", async ({
    pm,
  }) => {
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
      await pm.article().expectFormValues({
        title: articleData.initialTitle,
        description: articleData.initialDescription,
        body: articleData.initialBody,
      });
      await pm.article().expectTagVisible(articleData.initialTag);
      await pm.article().goBack();
    });

    await test.step("Update article", async () => {
      await pm.article().updateArticle({
        title: articleData.updatedTitle,
        description: articleData.updatedDescription,
        body: articleData.updatedBody,
        tag: articleData.updatedTag,
      });
    });

    await test.step("Verify all fields after update", async () => {
      await pm.article().openEditForm();
      await pm.article().expectFormValues({
        title: articleData.updatedTitle,
        description: articleData.updatedDescription,
        body: articleData.updatedBody,
      });
      await pm.article().expectTagVisible(articleData.updatedTag);
      await pm.article().goBack();
    });

    await test.step("Delete article", async () => {
      await pm.article().deleteArticle();
    });
  });
});
