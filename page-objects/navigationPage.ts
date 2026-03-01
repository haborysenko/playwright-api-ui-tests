import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async gotoHome() {
    await this.page.goto("/");
  }

  async loginPage() {
    await this.page.getByRole("link", { name: "Sign in" }).click();
  }

  async signUpPage() {
    await this.page.getByRole("link", { name: "Sign up" }).click();
  }

  async newArticlePage() {
    await this.page.getByRole("link", { name: "New Article" }).click();
    // Wait just to demonstrate the use of the helper base class
    await this.waitForNumberOfSeconds(1);
  }
}
