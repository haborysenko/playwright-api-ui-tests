import { Page } from "@playwright/test";
import { HelperBase } from "./helper-base";

export class ArticlePage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  // Locator getters — used both for filling and for value assertions
  titleInput() {
    return this.page.getByRole("textbox", { name: "Article Title" });
  }

  descriptionInput() {
    return this.page.getByRole("textbox", { name: "What's this article about?" });
  }

  bodyInput() {
    return this.page.getByRole("textbox", { name: "Write your article (in" });
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
    await this.titleInput().fill(title);
  }

  async fillDescription(description: string) {
    await this.descriptionInput().fill(description);
  }

  async fillBody(body: string) {
    await this.bodyInput().fill(body);
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

  async updateArticle(
    title: string,
    description: string,
    body: string,
    tag?: string,
  ) {
    await this.openEditForm();
    await this.fillTitle(title);
    await this.fillDescription(description);
    await this.fillBody(body);
    await this.fillTagIfProvided(tag);
    await this.submitArticle();
  }

  async deleteArticle() {
    await this.page
      .locator(".banner")
      .getByRole("button", { name: "Delete Article" })
      .click();
  }
}
