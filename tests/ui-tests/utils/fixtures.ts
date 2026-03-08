import { test as apiTest } from "../../api-tests/utils/fixtures";
import { PageManager } from "../../../support/ui/page-objects/page-manager";

type UiFixtures = {
  pm: PageManager;
};

export const test = apiTest.extend<UiFixtures>({
  pm: async ({ page }, use) => {
    await use(new PageManager(page));
  },
});

export { expect } from "@playwright/test";
