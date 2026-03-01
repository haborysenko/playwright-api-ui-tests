import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class AuthPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string) {
    await this.page.getByRole("textbox", { name: "Email" }).click();
    await this.page.getByRole("textbox", { name: "Email" }).fill(email);
    await this.page.getByRole("textbox", { name: "Password" }).click();
    await this.page.getByRole("textbox", { name: "Password" }).fill(password);
    await this.page.getByRole("button", { name: "Sign in" }).click();
  }
}
