import { Page } from "@playwright/test";

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Navigate back in the browser history. */
  async goBack() {
    await this.page.goBack();
  }

  async waitForNumberOfSeconds(timeInSeconds: number) {
    await this.page.waitForTimeout(timeInSeconds * 1000);
  }
}
