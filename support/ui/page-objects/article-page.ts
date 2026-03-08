import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helper-base";

export class ArticlePage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  /** Description input locator for assertions (e.g. expect(...).toHaveValue()). */
  descriptionInputLocator(): Locator {
    return this.page.getByRole("textbox", { name: "What's this article about?" });
  }

  validationErrors() {
    return this.page.locator("app-list-errors");
  }

  private async fillTagIfProvided(tag?: string) {
    if (tag !== undefined) {
      await this.page.getByRole("textbox", { name: "Enter tags" }).fill(tag);
    }
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

  async submitArticle() {
    await this.page.getByRole("button", { name: "Publish Article" }).click();
  }

  async openEditForm() {
    await this.page
      .locator(".banner")
      .getByRole("link", { name: "Edit Article" })
      .click();
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
    await this.fillTagIfProvided(tag);
    await this.submitArticle();
  }

  /** Only fills and submits fields that are provided; pass null to leave a field unchanged. */
  async updateArticle(
    title?: string | null,
    description?: string | null,
    body?: string | null,
    tag?: string | null,
  ) {
    await this.openEditForm();
    if (title != null) await this.fillTitle(title);
    if (description != null) await this.fillDescription(description);
    if (body != null) await this.fillBody(body);
    if (tag != null) await this.fillTagIfProvided(tag);
    await this.submitArticle();
  }

  async deleteArticle() {
    await this.page
      .locator(".banner")
      .getByRole("button", { name: "Delete Article" })
      .click();
  }
}
