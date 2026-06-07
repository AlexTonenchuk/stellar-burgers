import { test, expect } from '@playwright/test';
import ingredientsMock from './ingredients.json';
import userMock from './user.json';
import orderMock from './order.json';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/api-mock.har', {
      url: '**/api/**',
      update: false
    });

    await page.goto('/');
  });
  test('Должен отображать ингредиенты из моковых данных', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
  });

  test('Должен добавлять булку и начинку в конструктор при клике на кнопку Добавить', async ({
    page
  }) => {
    await page.locator('button', { hasText: 'Добавить' }).first().click();
    await page.locator('button', { hasText: 'Добавить' }).last().click();

    const constructorSection = page
      .locator('button:has-text("Оформить заказ")')
      .locator('..');

    await expect(constructorSection.locator('text=Краторная булка N-200i'))
      .toBeVisible;
    await expect(
      constructorSection.locator('text=Филе Люминесцентного Тетраодона')
    ).toBeVisible;
  });

  test('Должно открываться и закрываться по крестику модальное окно ингредиента', async ({
    page
  }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i').last()).toBeVisible();

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

    await expect(
      page.locator('div', { hasText: '123456' }).last()
    ).toBeVisible();

    await page
      .locator('button[class*="button"] svg')
      .first()
      .click({ force: true });

    const constructorSection = page
      .locator('button:has-text("Оформить заказ")')
      .locator('..');

    await expect(
      constructorSection.locator('text=Краторная булка N-200i')
    ).toHaveCount(0);
    await expect(
      constructorSection.locator('text=Филе Люминесцентного Тетраодона')
    ).toHaveCount(0);
  });
});
