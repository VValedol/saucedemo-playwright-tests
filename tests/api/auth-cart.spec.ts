import { test, expect } from '@playwright/test';

// Public demo account documented by dummyjson.com.
const USER = { username: 'emilys', password: 'emilyspass' };

test.describe('Auth API', () => {
  test('valid login returns a token that opens /auth/me', async ({ request }) => {
    const login = await request.post('/auth/login', { data: USER });
    expect(login.status()).toBe(200);
    const { accessToken, username } = await login.json();
    expect(username).toBe(USER.username);
    expect(accessToken).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);

    const me = await request.get('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } });
    expect(me.status()).toBe(200);
    expect((await me.json()).username).toBe(USER.username);
  });

  test('wrong password is rejected', async ({ request }) => {
    const res = await request.post('/auth/login', { data: { ...USER, password: 'wrong' } });
    expect(res.status()).toBe(400);
    expect((await res.json()).message).toBe('Invalid credentials');
  });

  test('protected endpoint without token is refused', async ({ request }) => {
    const res = await request.get('/auth/me');
    expect(res.status()).toBe(401);
  });
});

test.describe('Cart API', () => {
  test('cart totals match line items', async ({ request }) => {
    const res = await request.post('/carts/add', {
      data: { userId: 1, products: [{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }] },
    });
    expect(res.status()).toBe(201);
    const cart = await res.json();

    const sum = cart.products.reduce((acc: number, p: { total: number }) => acc + p.total, 0);
    expect(cart.total).toBeCloseTo(sum, 2);
    for (const p of cart.products) expect(p.total).toBeCloseTo(p.price * p.quantity, 2);
    expect(cart.totalQuantity).toBe(3);
    expect(cart.discountedTotal).toBeLessThanOrEqual(cart.total);
  });
});
