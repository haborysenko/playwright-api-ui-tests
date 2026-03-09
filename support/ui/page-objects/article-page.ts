import { expect, Page } from "@playwright/test";
import { HelperBase } from "./helper-base";

export class ArticlePage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async fillTitle(title: string) {
    await this.page.getByRole("textbox", { name: "Article Title" }).fill(title);
  }

  async fillDescription(description: string) {
    await this.page
      .getByRole("textbox", { name: "What's this article about?" })
      .fill(description);
  }

  async fillBody(body: string) {
    await this.page
      .getByRole("textbox", { name: "Write your article (in" })
      .fill(body);
  }

  async fillTag(tag: string) {
    await this.page.getByRole("textbox", { name: "Enter tags" }).fill(tag);
  }

  async submitArticle() {
    await this.page.getByRole("button", { name: "Publish Article" }).click();
  }

  async openEditForm() {
    await this.page
      .locator(".banner")
      .getByRole("link", { name: "Edit Article" })
      .click();
  }

  async expectEditArticleFormValues(expected: {
    title?: string;
    description?: string;
    body?: string;
    tag?: string;
  }) {
    if (expected.title !== undefined)
      await expect(
        this.page.getByRole("textbox", { name: "Article Title" }),
      ).toHaveValue(expected.title);
    if (expected.description !== undefined)
      await expect(
        this.page.getByRole("textbox", { name: "What's this article about?" }),
      ).toHaveValue(expected.description);
    if (expected.body !== undefined)
      await expect(
        this.page.getByRole("textbox", { name: "Write your article (in" }),
      ).toHaveValue(expected.body);

    if (expected.tag !== undefined)
      await expect(this.page.getByText(expected.tag)).toBeVisible();
  }

  // Description is not part of the article form, so it is not included in the expected values.
  async expectArticlePageValues(expected: {
    title?: string;
    body?: string;
    tag?: string;
  }) {
    if (expected.title !== undefined) {
      await expect(
        this.page.getByRole("heading", { name: expected.title }),
      ).toBeVisible();
    }
    if (expected.body !== undefined) {
      await expect(
        this.page.locator(".row.article-content").getByText(expected.body),
      ).toBeVisible();
    }
    if (expected.tag !== undefined) {
      await expect(
        this.page.getByRole("list").filter({ hasText: expected.tag }),
      ).toBeVisible();
    }
  }

  async createArticle(
    title: string,
    description: string,
    body: string,
    tag?: string,
  ) {
    await this.fillTitle(title);
    await this.fillDescription(description);
    await this.fillBody(body);
    if (tag !== undefined) await this.fillTag(tag);
    await this.submitArticle();
  }

  async updateArticle(updates: {
    title?: string;
    description?: string;
    body?: string;
    tag?: string;
  }) {
    await this.openEditForm();
    if (updates.title !== undefined) await this.fillTitle(updates.title);
    if (updates.description !== undefined)
      await this.fillDescription(updates.description);
    if (updates.body !== undefined) await this.fillBody(updates.body);
    if (updates.tag !== undefined) await this.fillTag(updates.tag);
    await this.submitArticle();
  }

  async deleteArticle() {
    await this.page
      .locator(".banner")
      .getByRole("button", { name: "Delete Article" })
      .click();
  }

  /** Asserts the article heading (title) is visible on the page. */
  async expectArticleTitleVisible(title: string) {
    await expect(this.page.getByRole("heading", { name: title })).toBeVisible();
  }

  async waitForArticlePage() {
    await expect(this.page).toHaveURL(/\/article\/.+/);
  }
}
