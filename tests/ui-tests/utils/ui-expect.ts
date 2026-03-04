import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

export async function expectValidationError(
  errors: Locator,
  message: string,
) {
  await expect(errors).toContainText(message);
}
