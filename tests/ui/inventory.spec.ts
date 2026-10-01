import { test, expect } from './fixtures';

test.describe('Product list', () => {
  test('sorting by price low → high orders all items', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.priceValues();
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorting by name Z → A orders all items', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.names.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('cart badge follows add and remove', async ({ loggedIn }) => {
    await expect(loggedIn.cartBadge).toBeHidden();
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Bike Light');
    await expect(loggedIn.cartBadge).toHaveText('2');
    await loggedIn.removeFromCart('Sauce Labs Backpack');
    await expect(loggedIn.cartBadge).toHaveText('1');
  });
});
