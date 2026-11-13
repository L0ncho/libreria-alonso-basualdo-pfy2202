# Decisiones técnicas

Cada decisión indica qué se hizo, por qué y qué alternativa se descartó. Los archivos citados están en `src/` salvo que se indique otra ruta.

## 1. Caché propia en vez de TanStack Query

**Decisión.** `services/clienteHttp.js` guarda en un `Map` en memoria la respuesta de cada URL. `obtenerJson(ruta)` devuelve lo guardado sin hacer otra petición; con `forzar: true` (usado por Reintentar) vuelve a pedir al servidor. `leerCache(ruta)` permite leer la caché de forma síncrona, y `hooks/useConsulta.js` la usa en el primer render para no mostrar el indicador de carga cuando los datos ya están.

**Motivo.** La actividad evalúa justamente cómo se evitan las peticiones repetidas, así que la lógica debe estar a la vista y explicada en el propio código. Los datos de la librería no cambian durante la visita, de modo que basta una caché sin expiración que dura hasta recargar la página.

**Alternativa descartada.** TanStack Query resuelve caché, deduplicación, reintentos y expiración, pero oculta exactamente lo que se evalúa y agrega una dependencia que las instrucciones del proyecto no permiten.

## 2. Peticiones compartidas con contador de consumidores

**Decisión.** Además de la caché, el cliente lleva un `Map` de peticiones en curso (`enCurso`). Si dos consumidores piden la misma URL mientras la primera petición no termina, el segundo se une a ella en vez de crear otra. Cada petición registra cuántos consumidores la esperan (`consumidores`), y cada consumidor recibe su propia promesa:

- Si un consumidor cancela (su `signal` se aborta), solo su promesa se rechaza con tipo `cancelado` y el contador baja.
- La petición de red se aborta con su propio `AbortController` recién cuando el contador llega a cero, es decir, cuando nadie más la espera.

**Motivo.** Cancelar la petición de red en cuanto un consumidor se va dejaría sin datos a los demás. No cancelarla nunca desperdiciaría ancho de banda si todos se fueron.

**Alternativa descartada.** Compartir directamente la promesa de `fetch` con un único `AbortController`: el primer consumidor que cancela rompe la petición para todos.

## 3. Cancelación diferida por StrictMode

**Decisión.** En `soltar`, cuando el contador llega a cero, el abort no es inmediato: se programa con `queueMicrotask` y se ejecuta solo si el contador sigue en cero.

**Motivo.** En desarrollo, `StrictMode` monta el efecto, lo limpia y lo vuelve a montar en la misma tarea:

1. La limpieza aborta la señal del primer montaje y el contador baja a cero.
2. El segundo montaje llama a `obtenerJson` antes de que corra la microtarea, encuentra la petición todavía en `enCurso` y sube el contador a uno.
3. Cuando corre la microtarea, el contador ya no es cero y la petición sigue viva.

El resultado es una sola petición de red, también en desarrollo. Una cancelación nunca se muestra como error: `useConsulta` ignora los errores de tipo `cancelado`.

**Alternativas descartadas.**
- Desactivar `StrictMode`: oculta errores reales de efectos.
- Guardar una bandera "ya pedido" en un `useRef`: no cancela al desmontar y no sirve entre componentes distintos.

## 4. Normalización de errores y 404 sin Reintentar

**Decisión.** Todo error pasa por `normalizarError` (`utils/errores.js`) y queda como `{ tipo, estado, mensaje }`, con `tipo` igual a `red`, `no-encontrado`, `servidor`, `cancelado` o `desconocido`:

- **Falla de red:** el cliente marca como `red` solo el rechazo de `fetch`.
- **Respuesta no exitosa:** se usa el `mensaje` del cuerpo JSON si el servidor lo envía.
- **Cualquier otro error** (por ejemplo, un `TypeError` del propio código) queda como `desconocido`, para no pedirle al usuario que revise su conexión ante un error de programación.

`components/AvisoErrorConsulta.jsx` decide la alternativa según el tipo:

- `no-encontrado` muestra solo un enlace a otra sección.
- El resto muestra Reintentar y el enlace.

**Motivo.** Las páginas no conocen detalles de HTTP: reaccionan a un tipo. Un 404 no cambia al reintentar (el recurso no existe), así que ofrecer Reintentar sería una acción inútil. Un 500 o una falla de red sí pueden resolverse al intentar de nuevo.

**Alternativa descartada.** Mostrar el mensaje de `error.message` tal como llega y un único botón Reintentar para todo: los mensajes serían técnicos y la acción no siempre tendría sentido.

## 5. Ids con convertirEntero

**Decisión.** Los ids llegan desde la URL como texto. Se convierten solo con `convertirEntero` (`utils/ids.js`):

- acepta solo dígitos, mayores que cero y dentro de los enteros seguros;
- devuelve `null` en cualquier otro caso;
- `"7"` y `"007"` dan `7`; `"0"`, `"-1"`, `"1.5"`, `"1e3"`, `" 7"` y `"abc"` dan `null`.

**Uso.**
- Los servicios (`services/libros.js`) construyen la ruta con el id convertido. Con `null` la ruta es `null` y `useConsulta` no hace la petición; la página muestra "No encontrado" con `errorIdInvalido`.
- Los handlers del mock (`mocks/handlers.js`) usan la misma función, así que la regla se cumple también en la API.

**Motivo.** `Number("1e3")` da 1000 y `parseInt("7abc")` da 7: aceptarían direcciones que no corresponden a ningún recurso. Además, al normalizar el id, `/categorias/7` y `/categorias/007` usan la misma URL de API y comparten la entrada de caché.

**Alternativa descartada.** Usar `Number` o `parseInt` en cada página, o dejar que la API responda 404 a cualquier texto: genera peticiones innecesarias y reglas distintas en cada punto de entrada.

## 6. No mostrar datos de otro recurso

**Decisión.** `useConsulta` mantiene visibles los últimos datos obtenidos mientras carga, para que un reintento no deje la pantalla vacía. Pero al pasar de `/categorias/1` a `/categorias/2`, esos últimos datos son de otra categoría. Por eso `useLibrosCategoria` y `useLibro` solo entregan los datos si la ruta que les corresponde es la que se está pidiendo:

```js
rutaLibrosCategoria(datos.categoria?.id) === ruta
rutaLibro(datos.id) === ruta
```

Si no coinciden, la página no recibe datos y muestra el título genérico con el indicador de carga. Al reintentar la misma categoría, los datos sí coinciden y siguen visibles.

**Motivo.** Mostrar los libros de Ficción bajo el título de Fantasía, aunque sea medio segundo, es información falsa. Al hacer la comprobación en el hook, se cumple en cualquier página que lo use, no solo en una.

**Alternativa descartada.** Hacer la comprobación en cada página, o borrar los datos anteriores en `useConsulta`. Lo segundo haría que Reintentar vaciara la pantalla.

## 7. Carga del mock en un archivo aparte

**Decisión.** `main.jsx` importa `mocks/browser.js` con `import()` dinámico, espera `iniciarMock()` y recién entonces renderiza. Si el archivo no se descarga o el worker no inicia, el error se registra en la consola y la aplicación se renderiza igual (`finally`). El worker se registra con `${import.meta.env.BASE_URL}mockServiceWorker.js`, alcance igual a la base y `onUnhandledRequest: 'bypass'`.

**Motivo.**
- MSW pesa unos 435 kB, más que el resto de la aplicación. En un archivo propio, su nombre con hash no cambia entre publicaciones si el mock no cambia, y el navegador lo reutiliza desde su caché.
- Esperar a `worker.start()` evita que la primera petición salga antes de que el mock esté listo.
- Registrar el worker con la base hace que funcione bajo `/libreria-alonso-basualdo-pfy2202/` en GitHub Pages.

**Alternativa descartada.** Importar MSW de forma estática en `main.jsx`: lo mezclaría con el código de la aplicación y cualquier cambio en las páginas obligaría a descargarlo de nuevo.

## 8. Base del sitio también en vista previa

**Decisión.** `vite.config.js` usa la base `/libreria-alonso-basualdo-pfy2202/` al compilar y en `vite preview` (`command === 'build' || isPreview`), y `/` en desarrollo.

**Motivo.** `vite preview` se ejecuta con `command === 'serve'`. Si la condición fuera solo `command === 'build'`, la vista previa serviría `dist` en la raíz mientras el código compilado apunta a la subcarpeta. El service worker se pediría bajo la base y recibiría `index.html` en vez del script. Con `isPreview`, `npm run preview` reproduce GitHub Pages.

**Alternativa descartada.** Usar la base solo al compilar, como en el proyecto del supermercado: la vista previa no permite comprobar el mock bajo la ruta publicada.

## 9. Clave librarte-tema y orden del color-scheme

**Decisión.** El tema elegido se guarda en `localStorage` con la clave `librarte-tema`, con los valores `oscuro` o `claro`. Hay dos lectores de esa clave:

- Un script en línea en `index.html` lee la clave y aplica `data-tema` en `<html>` antes de que cargue React. Sin elección guardada, usa la preferencia del sistema.
- `components/BotonTema.jsx` usa la misma clave y solo guarda una elección explícita.

En `index.css`, el bloque `[data-tema="oscuro"]` va después de `:root` dentro de `@layer base`.

**Motivo.**
- Todos los sitios publicados en `l0ncho.github.io` comparten el mismo `localStorage`, porque el origen es el dominio y no la subcarpeta. Una clave genérica como `tema` la pisaría otro proyecto del mismo dominio.
- El script en `index.html` evita el destello del tema claro al cargar.
- `:root` y `[data-tema="oscuro"]` tienen la misma especificidad y aplican al mismo elemento, así que gana el que va después. Si el bloque oscuro fuera antes, el `color-scheme: light` de `:root` prevalecería y los controles nativos (selector, barras de desplazamiento) quedarían claros en el tema oscuro.

**Alternativas descartadas.**
- Leer el tema solo en React: el tema claro se vería un instante.
- Usar la variante `dark:` de Tailwind en cada componente: el tema oscuro se resuelve redefiniendo las variables de color.
