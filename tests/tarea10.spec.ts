import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth';

// ============ RETO 1: Tags multiples + --grep-invert ============
test.describe('Tarea 10 - Reto 1: tags multiples', () => {

  test('Reto 1a - Header del inventario visible',
    { tag: ['@regression', '@ui'] }, async ({ page }) => {
    await loginAs(page, 'standard_user');
    await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
  });

  test('Reto 1b - Logout desde el menu',
    { tag: ['@regression', '@critico'] }, async ({ page }) => {
    await loginAs(page, 'standard_user');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('Reto 1c - Usuario bloqueado ve mensaje de error',
    { tag: ['@smoke', '@critico'] }, async ({ page }) => {
    await loginAs(page, 'locked_out_user');
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

});

// ============ RETO 2: expect.soft() ============
test.describe('Tarea 10 - Reto 2: soft assertions', () => {

  test('Reto 2a - Verificar todos los atributos del Backpack',
    { tag: '@regression' }, async ({ page }, testInfo) => {
    await loginAs(page, 'standard_user');
    const producto = page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' });

    // expect.soft NO detiene el test si una falla: sigue con las demas
    await expect.soft(producto.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect.soft(producto.locator('.inventory_item_price')).toHaveText('$29.99');
    await expect.soft(producto.locator('.inventory_item_desc')).toContainText('carry.allTheThings()');
    await expect.soft(producto.locator('img')).toBeVisible();
    await expect.soft(producto.locator('.btn_inventory')).toHaveText('Add to cart');

    console.log(`Reto 2a - Errores acumulados: ${testInfo.errors.length}`);
  });

  test('Reto 2b - Demostracion: varios fallos se reportan juntos',
    { tag: '@regression' }, async ({ page }, testInfo) => {
    // test.fail(): este test DEBE fallar; si falla, Playwright lo marca como correcto
    test.fail();
    await loginAs(page, 'standard_user');
    const producto = page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' });

    // Dos datos incorrectos a proposito: ninguno detiene el test
    await expect.soft(producto.locator('.inventory_item_price')).toHaveText('$99.99');
    await expect.soft(producto.locator('.btn_inventory')).toHaveText('Comprar');
    // Esta linea SI se ejecuta, prueba de que el test no se detuvo
    await expect.soft(producto.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

    console.log(`Reto 2b - Errores acumulados en testInfo.errors: ${testInfo.errors.length}`);
  });

});

// el RETO 3: fixture browserName 
test.describe('Tarea 10 - Reto 3: aserciones por motor', () => {

  test('Reto 3 - El user agent corresponde al motor real',
    { tag: '@ui' }, async ({ page, browserName }) => {
    await page.goto('https://www.saucedemo.com');
    const userAgent = await page.evaluate(() => navigator.userAgent);

    // En vez de test.skip(), se ajusta lo esperado segun el motor
    const esperadoPorMotor: Record<string, RegExp> = {
      chromium: /Chrome/,
      firefox: /Firefox/,
      webkit: /AppleWebKit/,
    };
    console.log(`Reto 3 - Motor: ${browserName} | UA: ${userAgent}`);
    expect(userAgent).toMatch(esperadoPorMotor[browserName]);
    await expect(page.locator('#login-button')).toBeVisible();
  });

});