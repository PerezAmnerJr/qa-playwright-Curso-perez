# Tabla de decisión - Checkout de Sauce Demo

**Amner Alberto Pérez Marroquín** — Carné 1790-227230
Laboratorio 05 · SUT: https://www.saucedemo.com

## Comportamiento verificado

Antes de armar la tabla probé el sitio para ver qué hace realmente:

- Entrar a `checkout-step-one.html` sin sesión: me saca a la raíz y muestra
  "You can only access '/checkout-step-one.html' when you are logged in".
- Hacer checkout con el carrito vacío: sí me deja pasar al formulario, sin
  ningún error.
- Los mensajes del formulario cambian según el campo que falta.
  Si dejo los tres vacíos, solo avisa del primero (First Name).

## Condiciones

- **C1** Usuario autenticado
- **C2** Carrito con productos
- **C3** First Name completado
- **C4** Last Name y Postal Code completados

## Tabla

| Condición | R1 | R2 | R3 | R4 | R5 | R6 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| C1 Autenticado | No | Sí | Sí | Sí | Sí | Sí |
| C2 Carrito con productos | — | No | Sí | Sí | Sí | Sí |
| C3 First Name | — | — | No | Sí | Sí | Sí |
| C4 Last Name y Postal Code | — | — | — | No | Parcial | Sí |
| **Resultado** | Acceso bloqueado | Permite avanzar | First Name is required | Last Name is required | Postal Code is required | Avanza al resumen |

`—` = no importa, la regla se decide antes. `Parcial` = falta el código postal.

## Reglas

**R1** — Sin sesión, el sistema bloquea el checkout y pide iniciar sesión.

**R2** — Con sesión pero carrito vacío, deja entrar al formulario igual.
Me parece un fallo: no debería poder iniciarse una compra sin productos.

**R3** — Falta el nombre