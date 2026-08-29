import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MenuPage } from '../pages/MenuPage';
test.describe('Clase 06 - Page Object Model en Sauce Demo', () => {

  test('Login exitoso con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectToBeOnInventoryPage();

    console.log('Login con POM exitoso');
  });

  test('Login fallido con POM', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('wrong_user', 'wrong_pass');

    await loginPage.expectLoginError(
      'Username and password do not match');

    console.log('Error de login capturado con POM');
  });

  test('Flujo completo: login -> agregar 2 productos -> verificar carrito', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    // Agregar productos por nombre
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.addProductByName('Sauce Labs Bike Light');

    // Verificar badge del carrito
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // Ir al carrito
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(2);

    console.log('Flujo completo con POM: 2 productos en carrito');
  });

  test('Verificar que el inventario tiene 6 productos', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);

    console.log('Inventario con POM:', count, 'productos');
  });

  test('Ordenar productos de mayor a menor precio', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    // Ordenar de mayor a menor precio
    await inventoryPage.sortBy('hilo');

    const precios = page.locator('.inventory_item_price');
    const primerPrecio = await precios.first().textContent();

    // Los precios deben estar en orden descendente
    const todosLosPrecios = await precios.allTextContents();
    const numericos = todosLosPrecios.map(
      p => parseFloat(p.replace('$', '')));

    for (let i = 0; i < numericos.length - 1; i++) {
      expect(numericos[i]).toBeGreaterThanOrEqual(numericos[i + 1]);
    }

    console.log('Precio más alto tras ordenar:', primerPrecio);
  });

});

  test('Reto 1: compra completa de principio a fin con CheckoutPage', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    // 2. Agregar un producto e ir al carrito
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(1);

    // 3. Iniciar el checkout (step-one)
    await cartPage.proceedToCheckout();

    // 4. Llenar el formulario (pasa a step-two)
    await checkoutPage.llenarFormulario('Amner', 'Perez', '01001');

    // 5. Finalizar la compra (pasa a checkout-complete)
    await checkoutPage.finalizarCompra();

    // 6. Verificar el mensaje de exito
    const mensaje = await checkoutPage.obtenerMensajeExito();
    expect(mensaje).toContain('Thank you for your order');

    console.log('Reto 1 - Compra completada:', mensaje);
  }); 

    test('Reto 2: cerrar sesion desde el menu hamburguesa con MenuPage', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const menuPage = new MenuPage(page);

    // 1. Login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    // 2. Abrir el menu y cerrar sesion
    await menuPage.logout();

    // 3. Verificar que volvimos al formulario de login
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeEmpty();

    console.log('Reto 2 - Sesion cerrada correctamente');
  });

    test('Reto 3: el badge del carrito desaparece al quitar todos los productos', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Login
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.expectToBeOnInventoryPage();

    // 2. Agregar 2 productos
    await inventoryPage.addProductByName('Sauce Labs Backpack');
    await inventoryPage.addProductByName('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // 3. Quitar el primero: el badge baja a 1
    await inventoryPage.removeProductByName('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 4. Quitar el segundo: el badge desaparece del DOM
    await inventoryPage.removeProductByName('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadgeHidden();

    console.log('Reto 3 - Badge eliminado al llegar a 0');
  });