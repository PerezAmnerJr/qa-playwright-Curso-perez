import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'https://practice.expandtesting.com';
const ISSUE_TYPOS = 'https://github.com/PerezAmnerJr/qa-playwright-Curso-perez/issues/3';
const TEXTO_CORRECTO = "Sometimes you'll see a typo, other times you won't.";

// Lee la frase de /typos y unifica los apóstrofes curvos para comparar.
// Toma solo la oración, desde "Sometimes" hasta el primer punto,
// para que no se cuele otro texto que la página pegue en la misma línea.
async function leerFraseTypos(page: Page): Promise<string> {
  const texto = (await page.locator('body').innerText()).replace(/[’‘]/g, "'");
  const frase = texto.match(/Sometimes[^.]*\./);
  return frase ? frase[0].trim() : texto.trim();
}

// Quita los códigos de color de la terminal que traen los mensajes de error.
function limpiar(mensaje: string): string {
  return mensaje.replace(/\u001b\[[0-9;]*m/g, '');
}

test.describe('Tarea 11 - Documentar defectos con Playwright', () => {

  // ============ RETO 3: borrador de reporte desde un afterEach ============
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.errors.length === 0) return;
    const borrador = [
      `# Borrador de bug report: ${testInfo.title}`,
      '',
      `**Ambiente:** ${testInfo.project.name} | Windows 11 | ${BASE_URL}`,
      `**URL:** ${page.url()}`,
      `**Fecha:** ${new Date().toLocaleString('es-GT')}`,
      '',
      '## Resultado obtenido',
      ...testInfo.errors.map((e, i) =>
        `${i + 1}. ${limpiar(e.message ?? 'Error sin mensaje').split('\n').slice(0, 4).join(' ')}`),
      '',
      '## Pendiente de completar',
      '- Pasos para reproducir',
      '- Resultado esperado',
      '- Severidad y prioridad',
    ].join('\n');
    await testInfo.attach('borrador-bug-report.md', {
      body: borrador,
      contentType: 'text/markdown',
    });
  });

  // ============ RETO 1: medir un defecto intermitente ============
  test('Reto 1 - Medir la frecuencia del error de texto en /typos',
    async ({ page }, testInfo) => {
    test.setTimeout(120000); // 12 recargas necesitan más de los 30 s por defecto
    const RECARGAS = 12;
    let conError = 0;
    const muestras: string[] = [];

    await page.goto(`${BASE_URL}/typos`);
    for (let i = 1; i <= RECARGAS; i++) {
      if (i > 1) await page.reload();
      const frase = await leerFraseTypos(page);
      const tieneError = frase !== TEXTO_CORRECTO;
      if (tieneError) conError++;
      muestras.push(`Recarga ${i}: ${tieneError ? 'CON ERROR' : 'correcto'} -> ${frase}`);
    }

    const porcentaje = Math.round((conError / RECARGAS) * 100);
    const resumen = `El error de texto apareció en ${conError} de ${RECARGAS} recargas (${porcentaje}%)`;
    console.log(`Reto 1 - ${resumen}`);
    console.log(muestras.join('\n'));

    testInfo.annotations.push({ type: 'frecuencia', description: resumen });
    await testInfo.attach('frecuencia-typos.txt', {
      body: [resumen, '', ...muestras].join('\n'),
      contentType: 'text/plain',
    });
    expect(muestras).toHaveLength(RECARGAS);
  });

  // ============ RETO 2: test.fixme con anotación de issue ============
  test.fixme('Reto 2 - El texto de /typos no debe tener errores', {
    annotation: { type: 'issue', description: ISSUE_TYPOS },
  }, async ({ page }) => {
    // Este test exige el texto correcto. No se ejecuta mientras el Issue siga abierto.
    await page.goto(`${BASE_URL}/typos`);
    expect(await leerFraseTypos(page)).toBe(TEXTO_CORRECTO);
  });

  // ============ RETO 3: test que dispara el borrador ============
  test('Reto 3 - Imágenes rotas generan un borrador de reporte', async ({ page }) => {
    test.fail(true, 'Defecto conocido: Issue #2 (BR-CLASE11-001)');
    await page.goto(`${BASE_URL}/broken-images`);
    const imagenes = page.locator('main img');
    await expect.poll(() => imagenes.evaluateAll(
      imgs => imgs.every(img => (img as HTMLImageElement).complete),
    )).toBe(true);
    const anchos = await imagenes.evaluateAll(
      imgs => imgs.map(img => (img as HTMLImageElement).naturalWidth),
    );
    // expect.soft: el borrador recibe TODAS las imágenes rotas, no solo la primera
    anchos.forEach((ancho, i) => {
      expect.soft(ancho, `Imagen ${i + 1} debe cargar`).toBeGreaterThan(0);
    });
  });

});