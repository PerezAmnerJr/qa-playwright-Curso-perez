import { Page, Locator, expect } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly botonMenu: Locator;
  readonly botonCerrarMenu: Locator;
  readonly linkLogout: Locator;
  readonly linkTodosLosItems: Locator;
  readonly linkResetear: Locator;

  constructor(page: Page) {
    this.page = page;
    this.botonMenu = page.locator('#react-burger-menu-btn');
    this.botonCerrarMenu = page.locator('#react-burger-cross-btn');
    this.linkLogout = page.locator('#logout_sidebar_link');
    this.linkTodosLosItems = page.locator('#inventory_sidebar_link');
    this.linkResetear = page.locator('#reset_sidebar_link');
  }

  async abrirMenu() {
    await this.botonMenu.click();
    await expect(this.linkLogout).toBeVisible();
  }

  async cerrarMenu() {
    await this.botonCerrarMenu.click();
  }

  async logout() {
    await this.abrirMenu();
    await this.linkLogout.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }
}