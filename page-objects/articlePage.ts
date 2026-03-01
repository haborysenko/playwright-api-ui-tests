import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class ArticlePage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async createNewArticle(
    title: string,
    description: string,
    body: string,
    tags: string,
  ) {
    await this.page.getByRole("textbox", { name: "Article Title" }).click();
    await this.page.getByRole("textbox", { name: "Article Title" }).fill(title);
    await this.page
      .getByRole("textbox", { name: "What's this article about?" })
      .click();
    await this.page
      .getByRole("textbox", { name: "What's this article about?" })
      .fill(description);
    await this.page
      .getByRole("textbox", { name: "Write your article (in" })
      .click();
    await this.page
      .getByRole("textbox", { name: "Write your article (in" })
      .fill(body);
    await this.page.getByRole("textbox", { name: "Enter tags" }).click();
    await this.page.getByRole("textbox", { name: "Enter tags" }).fill(tags);
    await this.page.getByRole("button", { name: "Publish Article" }).click();
  }

  async deleteArticle() {
    await this.page
      .locator(".banner")
      .getByRole("button", { name: "Delete Article" })
      .click();
  }
}
