import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly prices: Locator;
  readonly names: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.prices = page.getByTestId('inventory-item-price');
    this.names = page.getByTestId('inventory-item-name');
  }

  item(name: string) {
    return this.page.getByTestId('inventory-item').filter({ hasText: name });
  }

  async addToCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.getByTestId('product-sort-container').selectOption(option);
  }

  async priceValues(): Promise<number[]> {
    return (await this.prices.allTextContents()).map((p) => Number(p.replace('$', '')));
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }
}
