import { Page } from "@playwright/test";
import { HelperBase } from "./helper-base";

export class ArticlePage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  private async fillTagIfProvided(tag?: string) {
    if (tag !== undefined) {
      await this.fillTag(tag);
    }
  }

  async fillTitle(title: string) {
    await this.page
      .getByRole("textbox", { name: "Article Title" })
      .fill(title);
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
    await this.page
      .getByRole("textbox", { name: "Enter tags" })
      .fill(tag);
  }

  async submitArticle() {
    await this.page.getByRole("button", { name: "Publish Article" }).click();
  }

  validationErrors() {
    return this.page.locator("app-list-errors");
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

  async deleteArticle() {
    await this.page
      .locator(".banner")
      .getByRole("button", { name: "Delete Article" })
      .click();
  }

  async updateArticle(
    title: string,
    description: string,
    body: string,
    tag?: string,
  ) {
    await this.page
      .locator(".banner")
      .getByRole("link", { name: "Edit Article" })
      .click();
    await this.fillTitle(title);
    await this.fillDescription(description);
    await this.fillBody(body);
    await this.fillTagIfProvided(tag);
    await this.submitArticle();
  }
}
