import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { AuthPage } from "./authPage";
import { ArticlePage } from "./articlePage";

export class PageManager {
  private page: Page;
  private navigationPage: NavigationPage;
  private authPage: AuthPage;
  private articlePage: ArticlePage;

  constructor(page: Page) {
    this.page = page;
    this.navigationPage = new NavigationPage(this.page);
    this.authPage = new AuthPage(this.page);
    this.articlePage = new ArticlePage(this.page);
  }

  navigateTo() {
    return this.navigationPage;
  }

  auth() {
    return this.authPage;
  }

  article() {
    return this.articlePage;
  }
}
