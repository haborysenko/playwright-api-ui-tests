import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export async function expectValidationError(page: Page, message: string) {
  await expect(page.locator("app-list-errors")).toContainText(message);
}
