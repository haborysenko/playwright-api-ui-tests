import { test as base } from "@playwright/test";
import { PageManager } from "../../../support/ui/page-objects/page-manager";

export const test = base.extend<{ pm: PageManager }>({
  pm: async ({ page }, use) => {
    await use(new PageManager(page));
  },
});

