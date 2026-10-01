import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

// Public demo credentials shown on the saucedemo.com login page.
export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  password: 'secret_sauce',
};

type Pages = { login: LoginPage; inventory: InventoryPage; checkout: CheckoutPage; loggedIn: InventoryPage };

export const test = base.extend<Pages>({
  login: async ({ page }, use) => use(new LoginPage(page)),
  inventory: async ({ page }, use) => use(new InventoryPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
  loggedIn: async ({ page, login }, use) => {
    await login.open();
    await login.login(USERS.standard, USERS.password);
    await expect(page).toHaveURL(/inventory/);
    await use(new InventoryPage(page));
  },
});

export { expect };
