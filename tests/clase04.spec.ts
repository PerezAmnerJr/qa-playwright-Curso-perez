import { test, expect, Page } from '@playwright/test';

const usuario = {
    username: `testuser_${Date.now().toString().slice(-6)}`,
    password: 'Password123'
};

async function loginConReintento(page: Page, username: string, password: string, intentos = 5) {
    for (let i = 0; i < intentos; i++) {
        await page.locator('#navbarExample').getByRole('link', { name: 'Log in', exact: true }).click();
        await page.waitForSelector('#logInModal', { state: 'visible' });
        await page.locator('#loginusername').fill(username);
        await page.locator('#loginpassword').fill(password);
        await page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click();

        try {
            await page.waitForSelector('#nameofuser', { state: 'visible', timeout: 4000 });
            return;
        } catch {
            console.log(`Login intento ${i + 1}/${intentos} sin éxito todavía, reintentando...`);
            await page.waitForTimeout(1500);
        }
    }
    throw new Error(`No se pudo iniciar sesión con ${username} tras ${intentos} intentos`);
}

test.describe('Clase 04 - Flujo completo de usuario en DemoBlaze', () => {
    test('Registrar un nuevo usuario', async ({ page }) => {
        await page.goto('/');

        await page.locator('#navbarExample').getByRole('link', { name: 'Sign up', exact: true }).click();
        await page.waitForSelector('#signInModal', { state: 'visible' });

        await page.locator('#sign-username').fill(usuario.username);
        await page.locator('#sign-password').fill(usuario.password);
        await page.locator('#signInModal').screenshot({ path: './evidencias/registro-llenado.png' });

        // El handler de dialog se registra ANTES del clic que lo dispara
        const dialogPromise = new Promise<void>((resolve) => {
            page.once('dialog', async (dialog) => {
                console.log(`Alert dice: ${dialog.message()}`);
                await dialog.accept();
                resolve();
            });
        });

        await page.locator('#signInModal').getByRole('button', { name: 'Sign up' }).click();
        await dialogPromise;

        console.log(`Usuario ${usuario.username} registrado`);
    });

    test('Login con el usuario registrado', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            console.log(`Dialog: ${dialog.message()}`);
            await dialog.accept();
        });

        await page.goto('/');
        await loginConReintento(page, usuario.username, usuario.password);

        const nombreUsuario = await page.locator('#nameofuser').textContent();
        expect(nombreUsuario).toContain(usuario.username);

        console.log(`Login exitoso como: ${nombreUsuario}`);
    });

    test('Flujo completo: login -> agregar producto -> verificar carrito', async ({ page }) => {
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        await page.goto('/');
        await loginConReintento(page, usuario.username, usuario.password);

        await page.waitForSelector('.card-title a');
        const primerProducto = page.locator('.card-title a').first();
        const nombreProducto = await primerProducto.textContent();
        await primerProducto.click();

        await page.waitForLoadState('domcontentloaded');

        // Igual que con el registro de usuario: agregar al carrito es una
        // escritura en el backend que tarda un momento en propagarse antes
        // de que aparezca reflejada en /cart.html.
        await page.getByText('Add to cart').click();
        await page.waitForTimeout(2000);

        await page.locator('#navbarExample').getByRole('link', { name: 'Cart', exact: true }).click();
        await page.waitForURL('**/cart.html');
        await page.waitForTimeout(1500);

        const itemsCarrito = page.locator('#tbodyid tr');
        const cantidadItems = await itemsCarrito.count();
        expect(cantidadItems).toBeGreaterThanOrEqual(1);

        console.log(`Flujo completo exitoso. Producto "${nombreProducto}" en carrito.`);
        console.log(`Items en carrito: ${cantidadItems}`);

        await page.screenshot({ path: './evidencias/carrito-con-producto.png', fullPage: true });
    });

    test('Intentar login con credenciales incorrectas', async ({ page }) => {
        await page.goto('/');
        await page.locator('#navbarExample').getByRole('link', { name: 'Log in', exact: true }).click();
        await page.waitForSelector('#logInModal', { state: 'visible' });

        await page.locator('#loginusername').fill('usuario_que_no_existe');
        await page.locator('#loginpassword').fill('password_incorrecta');

        const dialogPromise = new Promise<string>((resolve) => {
            page.once('dialog', async (dialog) => {
                await dialog.accept();
                resolve(dialog.message());
            });
        });

        await page.locator('#logInModal').getByRole('button', { name: 'Log in' }).click();
        const mensajeAlert = await dialogPromise;

        expect(mensajeAlert).toBeTruthy();
        console.log(`Error mostrado: ${mensajeAlert}`);

        const usuarioLogueado = page.locator('#nameofuser');
        await expect(usuarioLogueado).not.toBeVisible();
    });

});

//Aqui adjunto los test de reto delatarea 4//
 test('Reto 1: Llenar formulario Place Order con fill()', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.card-title a');

    // aqui aagrego un producto segun al carrito 
    page.on('dialog', async (dialog) => { await dialog.accept(); });
    await page.locator('.card-title a').first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.getByText('Add to cart').click();
    await page.waitForTimeout(2000);

    // aqui ir al carrito y abrir el formulario Place Order
    await page.locator('#navbarExample').getByRole('link', { name: 'Cart', exact: true }).click();
    await page.waitForURL('**/cart.html');
    await page.getByRole('button', { name: 'Place Order' }).click();
    await page.waitForSelector('#orderModal', { state: 'visible' });

    // Llenar el formulario con fill()
    await page.locator('#name').fill('Amner Perez');
    await page.locator('#country').fill('Guatemala');
    await page.locator('#city').fill('Guatemala City');
    await page.locator('#card').fill('4111111111111111');

    // Verificamosr que el botón Purchase es visible
    await expect(page.getByRole('button', { name: 'Purchase' })).toBeVisible();
  });
   
  // aqui el reto 2
  test('Reto 2: Cerrar el modal de login con boton Close', async ({ page }) => {
    await page.goto('/');

    // Abrir  login
    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Log in', exact: true }).click();
    await page.waitForSelector('#logInModal', { state: 'visible' });

    
    await page.getByRole('button', { name: 'Close' }).last().click();

    // aqui oparece si es visible
    await expect(page.locator('#logInModal')).not.toBeVisible();
  });

  // aqui el reto 3

  test('Reto 3: Llenar y borrar un campo con clear()', async ({ page }) => {
    await page.goto('/');

    // Abrir el modal de login
    await page.locator('#navbarExample')
      .getByRole('link', { name: 'Log in', exact: true }).click();
    await page.waitForSelector('#logInModal', { state: 'visible' });

    const campoUsuario = page.locator('#loginusername');

    // Llenar el campo con fill()
    await campoUsuario.fill('texto de prueba');

    // Verificar que el campo tiene ese texto
    expect(await campoUsuario.inputValue()).toBe('texto de prueba');

    // Borrar el campo con clear()
    await campoUsuario.clear();

    // Verificar que el campo quedo vacio con inputValue()
    expect(await campoUsuario.inputValue()).toBe('');
  });