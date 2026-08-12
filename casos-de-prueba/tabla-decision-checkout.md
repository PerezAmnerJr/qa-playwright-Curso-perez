# Tabla de decisión - Checkout de Sauce Demo
Amner Alberto Pérez Marroquín Tarea  05 

## aqui muestro los Comportamiento verificado

Antes de armar la tabla probé el sitio para ver qué hace realmente:

- Entrar a `checkout-step-one.html` sin sesión: me saca a la raíz y muestra
  "You can only access '/checkout-step-one.html' when you are logged in".
- Hacer checkout con el carrito vacío: sí me deja pasar al formulario, sin
  ningún error.
- Los mensajes del formulario cambian según el campo que falta.
  Si dejo los tres vacíos, solo avisa del primero (First Name).

## Condiciones

 Usuario autenticado
-  Carrito con productos
-  First Name completado
-  Last Name y Postal Code completados




## estas son las Reglas

**R1** — Sin sesión, el sistema bloquea el checkout y pide iniciar sesión.

**R2** — Con sesión pero carrito vacío, deja entrar al formulario igual.
Me parece un fallo: no debería poder iniciarse una compra sin productos.

**R3** — Falta el nombre → `First Name is required`.

**R4** — Falta el apellido → `Last Name is required`.

**R5** — Falta el código postal → `Postal Code is required`.

**R6** — Todo completo → pasa al resumen de la compra.

## Mi punto de Vista 

El acceso sin sesión sí está protegido, pero el carrito vacío no se valida,
que fue lo que más me llamó la atención. Las validaciones del formulario son
una por una, así que si el usuario deja todo vacío tiene que corregir en tres
intentos.

Armar la tabla probando primero el sitio me sirvió para ver que lo que yo
esperaba (que bloqueara el carrito vacío) no era lo que pasa en realidad.