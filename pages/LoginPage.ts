import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.error = page.getByTestId('error');
  }

  async open() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.getByTestId('username').fill(username);
    await this.page.getByTestId('password').fill(password);
    await this.page.getByTestId('login-button').click();
  }

  async expectError(text: string) {
    await expect(this.error).toContainText(text);
  }
}
