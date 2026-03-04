import { Page } from "@playwright/test";
import { HelperBase } from "./helper-base";

export class AuthPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string) {
    await this.page.getByRole("textbox", { name: "Email" }).fill(email);
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
    await this.page
      .getByRole("link", { name: "New Article" })
      .waitFor({ state: "visible" });
  }
}
