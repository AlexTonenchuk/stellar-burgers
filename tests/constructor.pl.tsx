import { test, expect } from '@playwright/test';
import ingredientsMock from './ingredients.json';
import userMock from './user.json';
import orderMock from './order.json';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: ingredientsMock
        })
      });
    });

    await page.goto('/');
  });

  test('Должен отображать ингредиенты из моковых данных', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
  });

  test('Должен добавлять булку и начинку в конструктор при клике на кнопку Добавить', async ({
    page
  }) => {
    const bunCard = page.locator('text=Краторная булка N-200i');
    await page.locator('button', { hasText: 'Добавить' }).first().click();

    await page.locator('button', { hasText: 'Добавить' }).last().click();

    await expect(page.locator('text=Краторная булка N-200i')).toHaveCount(3);

    await expect(
      page.locator('text=Филе Люминесцентного Тетраодона')
    ).toHaveCount(2);
  });

  test('Должно открываться и закрываться по крестику модальное окно ингредиента', async ({
    page
  }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page
      .locator('button[class*="button"] svg')
      .first()
      .click({ force: true });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('Должно закрываться по клику на оверлей модальное окно ингредиента', async ({
    page
  }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page
      .locator('div')
      .last()
      .click({ position: { x: 10, y: 10 } });

    await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
  });

  test('Должен успешно оформлять заказ', async ({ page, context }) => {
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: userMock.user
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(orderMock)
      });
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        url: 'http://localhost:3000'
      }
    ]);

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.reload();

    await page.locator('button', { hasText: 'Добавить' }).first().click();

    await page.locator('button', { hasText: 'Оформить заказ' }).click();

    await expect(page.getByText('123456')).toBeVisible();

    await page
      .locator('button[class*="button"] svg')
      .first()
      .click({ force: true });

    await expect(page.locator('text=Краторная булка N-200i')).toHaveCount(1);
  });
});
