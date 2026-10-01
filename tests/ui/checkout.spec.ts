import { test, expect } from './fixtures';
import { CheckoutPage } from '../../pages/CheckoutPage';

const ITEMS = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket'];

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn }) => {
    for (const item of ITEMS) await loggedIn.addToCart(item);
    await loggedIn.openCart();
  });

  test('order totals: item sum + 8% tax = total', async ({ page, checkout }) => {
    const cartPrices = (await page.getByTestId('inventory-item-price').allTextContents()).map((p) =>
      Number(p.replace('$', '')),
    );
    await checkout.start();
    await checkout.fillInfo('Test', 'Buyer', '1000');

    const itemTotal = CheckoutPage.amount(await checkout.itemTotal.innerText());
    const tax = CheckoutPage.amount(await checkout.tax.innerText());
    const total = CheckoutPage.amount(await checkout.total.innerText());

    const expectedSum = cartPrices.reduce((a, b) => a + b, 0);
    expect(itemTotal).toBeCloseTo(expectedSum, 2);
    expect(tax).toBeCloseTo(Math.round(itemTotal * 0.08 * 100) / 100, 2);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  test('completed order empties the cart', async ({ page, checkout }) => {
    await checkout.start();
    await checkout.fillInfo('Test', 'Buyer', '1000');
    await checkout.finish();
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
  });

  test('customer info is required', async ({ checkout }) => {
    await checkout.start();
    await checkout.fillInfo('', 'Buyer', '1000');
    await expect(checkout.error).toContainText('First Name is required');
  });
});
