import { test, expect } from '@playwright/test';

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
    await page
      .locator('li', { hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li', { hasText: 'Биокотлета из марсианской Магнолии' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructorSection = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(
      constructorSection.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();

    await expect(
      constructorSection.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
  });

  test('Должно открываться и закрываться по крестику модальное окно ингредиента', async ({
    page
  }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    const modalContainer = page.locator('#modals');

    await expect(modalContainer.getByText('Детали ингредиента')).toBeVisible();
    await expect(
      modalContainer.getByText('Краторная булка N-200i')
    ).toBeVisible();

    await modalContainer.getByRole('button').click({ force: true });

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

    const modalContainer = page.locator('#modals');
    await expect(modalContainer.getByText('123456')).toBeVisible();

    await modalContainer.getByRole('button').click({ force: true });

    const constructorSection = page
      .locator('section')
      .filter({ hasText: 'Оформить заказ' });

    await expect(
      constructorSection.getByText('Выберите булки').first()
    ).toBeVisible();
    await expect(
      constructorSection.getByText('Выберите начинку')
    ).toBeVisible();
  });
});
