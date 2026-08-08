aqui doty a conocer la tarea 04 sobreReflexión sobre los principios del testing (ISTQB)

¿Cuál de los 7 principios me parece más importante y por qué?

Para mí, el principio más importante es el Principio 1: las pruebas muestran la presencia de defectos, no su ausencia.

Este principio explica que cuando un test pasa, no significa que el software esté libre de errores; solo significa que no encontramos un error en esa prueba específica. Encontrar defectos demuestra que existen, pero nunca podemos afirmar con certeza que ya no queda ninguno. pero en este caso considero el más importante porque marca la actitud correcta de un QA: nunca dar por hecho que un sistema es perfecto solo porque los tests pasaron. En este laboratorio lo viví al automatizar el login y el carrito: aunque mis 7 tests pasaron, eso no garantiza que no existan otros escenarios con fallos que no estoy probando todavía. Este principio me mantiene con una mentalidad crítica y me recuerda que siempre puede haber más por verificar.

Respuestas a las preguntas de discusión

¿Qué principio ISTQB aplica el test de "login con credenciales incorrectas"?
Apca el Principio 1 (las pruebas muestran la presencia de defectos): al probar el camino negativo, verificamos que el sistema rechaza correctamente datos inválidos, buscando activamente posibles fallos en lugar de asumir que todo funciona.

¿Se puede garantizar que ningunusuario haga login con contraseña incorrecta? 
No. Por el Principio 2 (las pruebas exhaustivas son imposibles), no podemos probar todas las combinaciones posibles de usuarios y contraseñas. Podemos aumentar la confianza probando varios casos, pero nunca garantizar el 100%.

Si se ejecuta 100 veces sin cambiar nada, ¿seguirá encontrando defectos nuevos? 
No. Por el Principio 5 (paradoja del pesticida), repetir los mismos tests sin cambiarlos deja de encontrar defectos nuevos. Para hallar más, hay que revisar y actualizar los casos de prueba con nuevos escenarios.

esos son los principios que adjunto 