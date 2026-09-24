import { test as base, expect, test } from '@playwright/test';

type TimerFixture = {
  cronometro: void;
};

export const testConCronometro = base.extend<TimerFixture>({
  cronometro: [async ({}, use, testInfo) => {
    // Setup: arranca el cronómetro
    const inicio = Date.now();

    await use();

    // Teardown: corre siempre, incluso si el test falla
    const duracion = Date.now() - inicio;
    console.log(`Reto 1 - "${testInfo.title}" tardo ${duracion}ms`);
  }, { auto: true }],
});

testConCronometro.describe('Tarea 09 - Reto 1: fixture con teardown real', () => {

  testConCronometro('Test rapido con cronometro automatico', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await expect(page.locator('#login-button')).toBeVisible();
  });

  testConCronometro('Test con mas pasos, para comparar duracion', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);
  });

});

type CounterFixture = {
  contadorDeWorker: { valor: number };
};

export const testConContador = base.extend<{}, CounterFixture>({
  contadorDeWorker: [async ({}, use) => {
    // Este objeto se crea UNA SOLA VEZ por worker, no por test
    const estado = { valor: 0 };
    await use(estado);
  }, { scope: 'worker' }],
});

testConContador.describe('Tarea 09 - Reto 2: fixture de alcance worker', () => {
  testConContador.describe.configure({ mode: 'serial' });

  testConContador('Primer test: el contador arranca en 0 y sube a 1',
    async ({ contadorDeWorker }) => {
    expect(contadorDeWorker.valor).toBe(0);
    contadorDeWorker.valor++;
    console.log(`Reto 2 - Contador despues del primer test: ${contadorDeWorker.valor}`);
  });

  testConContador('Segundo test: el contador conserva el valor anterior y sube a 2',
    async ({ contadorDeWorker }) => {
    expect(contadorDeWorker.valor).toBe(1);
    contadorDeWorker.valor++;
    console.log(`Reto 2 - Contador despues del segundo test: ${contadorDeWorker.valor}`);
  });

});

const viewportsAProbar = [
  { nombre: 'movil', width: 375, height: 667 },
  { nombre: 'escritorio', width: 1280, height: 800 },
];

test.describe('Tarea 09 - Reto 3: test.use() + parametrizacion de viewports', () => {

  for (const viewport of viewportsAProbar) {
    test.describe(`Viewport: ${viewport.nombre}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test(`El login es usable en ${viewport.nombre} (${viewport.width}x${viewport.height})`,
        async ({ page }) => {
        await page.goto('https://www.saucedemo.com');

        await expect(page.locator('#user-name')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.locator('#login-button')).toBeVisible();

        console.log(`Reto 3 - Login verificado en ${viewport.nombre} (${viewport.width}x${viewport.height})`);
      });
    });
  }

});