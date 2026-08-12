import { test, expect } from '@playwright/test';

test.describe('Clase 05 - Assertions y técnicas de diseño de pruebas en Sauce Demo', () => {

  // ===================================================================
  // SECCIÓN A - Partición de equivalencia y valores frontera
  // ===================================================================

  test('CE válida: login con credenciales correctas', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Assertion: debemos llegar al inventario
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.inventory_container')).toBeVisible();

    console.log('CE válida: login exitoso');
  });

  test('CE inválida: usuario no existe', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('usuario_inexistente');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Assertion: debe aparecer mensaje de error
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Username and password do not match');

    // Assertion: NO debemos haber navegado al inventario
    await expect(page).not.toHaveURL(/inventory/);

    console.log('CE usuario inexistente: acceso denegado correctamente');
  });

  test('CE inválida: usuario bloqueado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('locked out');

    console.log('CE usuario bloqueado: mensaje correcto mostrado');
  });

  test('Valor en frontera: campos vacíos (frontera de longitud mínima)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // No llenar nada y hacer clic
    await page.locator('#login-button').click();

    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Username is required');

    console.log('Valor frontera: campo vacío maneja error correctamente');
  });

  // ===================================================================
  // SECCIÓN B - Assertions sobre el inventario
  // ===================================================================

  test('Verificar que el inventario tiene exactamente 6 productos', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    // Contar productos con assertion exacta
    const productos = page.locator('.inventory_item');
    await expect(productos).toHaveCount(6);

    console.log('El inventario tiene exactamente 6 productos');
  });

  test('Verificar precio del primer producto con regex', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const textoPrecio = await page.locator('.inventory_item_price')
      .first().textContent();

    // El regex valida el formato $XX.XX (p.ej. $29.99)
    expect(textoPrecio?.trim()).toMatch(/^\$\d+\.\d{2}$/);

    console.log('Precio con formato válido:', textoPrecio?.trim());
  });

  test('Verificar atributos y estados de los elementos del inventario', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const primerBoton = page.locator('.btn_inventory').first();
    await expect(primerBoton).toBeEnabled();
    await expect(primerBoton).toHaveText('Add to cart');

    // Clic y verificar que cambió a 'Remove'
    await primerBoton.click();
    await expect(primerBoton).toHaveText('Remove');

    // Verificar que el carrito muestra 1 item
    const badgeCarrito = page.locator('.shopping_cart_badge');
    await expect(badgeCarrito).toBeVisible();
    await expect(badgeCarrito).toHaveText('1');

    console.log('El botón cambia de estado y el carrito se actualiza');
  });

  // ===================================================================
  // SECCIÓN C - Soft assertions
  // ===================================================================

  test('Verificar múltiples propiedades del primer producto con soft assertions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const primerProducto = page.locator('.inventory_item').first();

    // Con soft assertions, si una falla, las demás siguen
    await expect.soft(primerProducto.locator('.inventory_item_name')).toBeVisible();
    await expect.soft(primerProducto.locator('.inventory_item_desc')).toBeVisible();
    await expect.soft(primerProducto.locator('.inventory_item_price')).toBeVisible();
    await expect.soft(primerProducto.locator('.btn_inventory')).toBeEnabled();
    await expect.soft(primerProducto.locator('img')).toBeVisible();

    console.log('Soft assertions del primer producto completadas');
  });

  // ===================================================================
  // SECCIÓN D - Tabla de decisión
  // ===================================================================

  test('Tabla de decisión - Regla 1: logueado con items -> puede pagar', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Agregar item
    await page.locator('.btn_inventory').first().click();

    // Ir al carrito
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart/);

    // Debe existir el botón de checkout
    const btnCheckout = page.locator('#checkout');
    await expect(btnCheckout).toBeVisible();
    await expect(btnCheckout).toBeEnabled();

    console.log('Regla 1: usuario logueado con items puede iniciar el pago');
  });

  test('Tabla de decisión - Regla 2: logueado sin items -> carrito vacío', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Ir al carrito sin agregar nada
    await page.locator('.shopping_cart_link').click();

    // El carrito debe estar vacío
    const itemsCarrito = page.locator('.cart_item');
    await expect(itemsCarrito).toHaveCount(0);

    console.log('Regla 2: carrito vacío confirmado, 0 items');
  });

  
  // TESTS RETO - TAREA 05
  // Cada reto usa una assertion 
  test('Reto 1 - toHaveValue(): ordenar el catálogo por precio', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const selectorOrden = page.locator('[data-test="product-sort-container"]');

    // Estado inicial: el catálogo viene ordenado por nombre (A to Z)
    await expect(selectorOrden).toHaveValue('az');

    // Ordenar de menor a mayor precio
    await selectorOrden.selectOption('lohi');

    // toHaveValue() lee el value interno del select, no su texto visible
    await expect(selectorOrden).toHaveValue('lohi');

    // El primer producto ahora debe ser el más barato del catálogo
    const primerPrecio = page.locator('.inventory_item_price').first();
    await expect(primerPrecio).toHaveText('$7.99');

    console.log('Reto 1 - orden aplicado:', await selectorOrden.inputValue());
    console.log('Reto 1 - primer precio tras ordenar:', await primerPrecio.textContent());
  });

  // Reto 2: toBeFocused() - verifica qué elemento tiene el foco del teclado
  test('Reto 2 - toBeFocused(): el campo de usuario recibe el foco', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    const campoUsuario = page.locator('#user-name');
    const campoPassword = page.locator('#password');

    // Estado inicial: sin interacción, el campo no tiene el foco
    await expect(campoUsuario).not.toBeFocused();

    // Al hacer clic, el campo recibe el foco del teclado
    await campoUsuario.click();
    await expect(campoUsuario).toBeFocused();

    // Solo un elemento puede tener el foco a la vez
    await expect(campoPassword).not.toBeFocused();

    // Con Tab el foco pasa al siguiente campo del formulario
    await page.keyboard.press('Tab');
    await expect(campoPassword).toBeFocused();
    await expect(campoUsuario).not.toBeFocused();

    console.log('Reto 2 - el foco se mueve correctamente entre los campos');
  });

  // Reto 3: toHaveCSS() - verifica un estilo computado por el navegador
  test('Reto 3 - toHaveCSS(): estilos computados del botón Add to cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    const botonAgregar = page.locator('.btn_inventory').first();
    await expect(botonAgregar).toBeVisible();

    // toHaveCSS() lee el estilo computado por el navegador, no el CSS escrito
    // El cursor tipo 'pointer' indica visualmente que el elemento es clickeable
    await expect(botonAgregar).toHaveCSS('cursor', 'pointer');

    // Los colores computados siempre se devuelven en formato rgb()
    const colorFondo = await botonAgregar.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    console.log('Reto 3 - cursor del botón: pointer');
    console.log('Reto 3 - color de fondo computado:', colorFondo);
  });

});