import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly campoNombre: Locator;
  readonly campoApellido: Locator;
  readonly campoCodigoPostal: Locator;
  readonly botonContinuar: Locator;
  readonly botonFinish: Locator;
  readonly mensajeExito: Locator;
  readonly totalAPagar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.campoNombre = page.locator('#first-name');
    this.campoApellido = page.locator('#last-name');
    this.campoCodigoPostal = page.locator('#postal-code');
    this.botonContinuar = page.locator('#continue');
    this.botonFinish = page.locator('#finish');
    this.mensajeExito = page.locator('.complete-header');
    this.totalAPagar = page.locator('.summary_total_label');
  }

  async llenarFormulario(nombre: string, apellido: string, codigoPostal: string) {
    await this.campoNombre.fill(nombre);
    await this.campoApellido.fill(apellido);
    await this.campoCodigoPostal.fill(codigoPostal);
    await this.botonContinuar.click();
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async finalizarCompra() {
    await this.botonFinish.click();
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  async obtenerMensajeExito(): Promise<string> {
    return (await this.mensajeExito.textContent()) ?? '';
  }
}