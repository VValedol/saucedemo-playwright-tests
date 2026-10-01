import { test, expect, USERS } from './fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ login }) => {
    await login.open();
  });

  test('standard user lands on the product list', async ({ page, login, inventory }) => {
    await login.login(USERS.standard, USERS.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventory.title).toHaveText('Products');
  });

  test('locked-out user sees a clear error', async ({ login }) => {
    await login.login(USERS.lockedOut, USERS.password);
    await login.expectError('Sorry, this user has been locked out.');
  });

  test('wrong password is rejected', async ({ page, login }) => {
    await login.login(USERS.standard, 'wrong-password');
    await login.expectError('Username and password do not match');
    await expect(page).not.toHaveURL(/inventory/);
  });

  const emptyFieldCases = [
    { field: 'username', user: '', pass: USERS.password, message: 'Username is required' },
    { field: 'password', user: USERS.standard, pass: '', message: 'Password is required' },
  ];
  for (const { field, user, pass, message } of emptyFieldCases) {
    test(`empty ${field} shows validation message`, async ({ login }) => {
      await login.login(user, pass);
      await login.expectError(message);
    });
  }

  test('inventory page is not reachable without login', async ({ page, login }) => {
    await page.goto('/inventory.html');
    await login.expectError('when you are logged in');
  });
});
