import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Tarea 07 - Evidencias avanzadas', () => {

  test('Reto 1: login estructurado con test.step()', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await test.step('Navegar a saucedemo', async () => {
      await loginPage.navigate();
    });

    await test.step('Iniciar sesion con usuario valido', async () => {
      await loginPage.login('standard_user', 'secret_sauce');
    });

    await test.step('Verificar que se llego al inventario', async () => {
      await inventoryPage.expectToBeOnInventoryPage();
    });

    console.log('Reto 1 - Test estructurado en pasos con test.step()');
  });

});

  test('Reto 2: adjuntar datos capturados con testInfo.attach()', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    const cantidadProductos = await inventoryPage.getProductCount();
    const urlActual = page.url();
    const fecha = new Date().toISOString();

    const contenido = `Reporte de ejecucion - Tarea 07
Cantidad de productos en inventario: ${cantidadProductos}
URL visitada: ${urlActual}
Fecha de ejecucion: ${fecha}`;

    await testInfo.attach('datos-capturados.txt', {
      body: contenido,
      contentType: 'text/plain',
    });

    console.log('Reto 2 - Archivo adjuntado al reporte HTML');
  });

    test('Reto 3: comparacion visual con toHaveScreenshot()', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    await expect(page).toHaveScreenshot('inventario-baseline.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });

    console.log('Reto 3 - Comparacion visual completada');
  });