import { test, expect, Page } from '@playwright/test';
import { loginAs } from '../helpers/auth';

test.describe('Tarea 08 - Reto 1: suite serial con pagina compartida', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loginAs(page, 'standard_user');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Paso 1: agregar un producto al carrito', async () => {
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Paso 2: el carrito conserva el producto agregado', async () => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('Paso 3: se puede avanzar al checkout desde el mismo carrito', async () => {
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

});

test.describe('Tarea 08 - Reto 2: test.slow() en usuario lento', () => {

  test('Login con usuario de rendimiento degradado marcado como slow', async ({ page }) => {
    test.slow();

    const inicio = Date.now();
    await loginAs(page, 'performance_glitch_user');
    const tiempoLogin = Date.now() - inicio;

    console.log(`Tiempo de login (marcado como slow): ${tiempoLogin}ms`);
    await expect(page).toHaveURL(/inventory/);
  });

});

test.describe('Tarea 08 - Reto 3: test.skip() dinamico', () => {

  test('Verificar checkout solo si el carrito tiene productos', async ({ page }) => {
    await loginAs(page, 'standard_user');

    const cantidadEnCarrito = await page.locator('.shopping_cart_badge').count();

    if (cantidadEnCarrito === 0) {
      test.skip(true, 'El carrito esta vacio: no tiene sentido verificar el checkout sin productos agregados');
    }

    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one/);
  });

});