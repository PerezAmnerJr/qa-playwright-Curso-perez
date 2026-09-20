# SQA Plan mínimo — Sauce Demo

**Curso:** Aseguramiento de la Calidad del Software Clase 08
**Estudiante:** Amner Alberto Pérez Marroquín
**Sistema bajo prueba:** https://www.saucedemo.com

## Propósito

Fue que verificamos que las funciones críticas de saucedemo (login, inventario, carrito, checkout y logout) funcionen correctamente antes de considerar la aplicación lista para un deploy, xq en este caso detectando errores de comportamiento antes de que lleguen a producción.

## Alcance

Se prueba:login con distintos usuarios (válido, inválido, bloqueado, con rendimiento degradado), inventario (cantidad de productos, precios, imágenes), carrito de compras, flujo de checkout completo y logout desde el menú.

No se prueba:rendimiento bajo carga real (solo se documenta el delay artificial de `performance_glitch_user` como hallazgo), seguridad ni penetración, ni compatibilidad entre distintos navegadores (los tests corren únicamente en Chromium).

## Herramientas

Playwright con TypeScript, usando el patrón Page Object Model para las páginas principales y funciones helper reutilizables (`helpers/auth.ts`) para acciones repetidas como el login.

## Criterios de salida
se consideroo que la suite está lista cuando el 100% de los tests críticos (login, inventario, checkout, logout) pasa correctamente, tanto en modo paralelo como en modo secuencial, sin necesidad de reintentos (`retries`).