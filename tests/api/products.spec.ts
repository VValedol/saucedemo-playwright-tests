import { test, expect } from '@playwright/test';

test.describe('Products API', () => {
  test('pagination returns the requested slice', async ({ request }) => {
    const res = await request.get('/products', { params: { limit: 5, skip: 10, select: 'title,price' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.limit).toBe(5);
    expect(body.skip).toBe(10);
    expect(body.products).toHaveLength(5);
    expect(body.products[0].id).toBe(11);
    expect(Object.keys(body.products[0]).sort()).toEqual(['id', 'price', 'title']);
  });

  test('single product has the expected contract', async ({ request }) => {
    const res = await request.get('/products/1');
    expect(res.ok()).toBeTruthy();
    const product = await res.json();
    expect(product).toMatchObject({
      id: 1,
      title: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
      category: expect.any(String),
    });
    expect(product.price).toBeGreaterThan(0);
  });

  test('search returns only matching products', async ({ request }) => {
    const res = await request.get('/products/search', { params: { q: 'phone' } });
    const { products, total } = await res.json();
    expect(total).toBeGreaterThan(0);
    for (const p of products) {
      expect(`${p.title} ${p.description}`.toLowerCase()).toContain('phone');
    }
  });

  test('unknown product returns 404 with a message', async ({ request }) => {
    const res = await request.get('/products/99999');
    expect(res.status()).toBe(404);
    expect((await res.json()).message).toContain('not found');
  });
});
