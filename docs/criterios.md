# Cómo se cumple cada criterio

[← Volver al README](../README.md)

Las pruebas citadas se describen en [Pruebas](pruebas.md) y los modos de simulación en [API simulada](api-simulada.md).

## 1. Mock REST integrado por completo

**Implementado**
- Tres recursos REST con MSW (`src/mocks/handlers.js`) y datos separados en `src/mocks/datos.js`.
- 404 con mensaje propio, una categoría sin libros, un modo para el error 500 y otro para la falla de red.
- `main.jsx` espera a que el worker inicie antes de renderizar, para que ninguna petición se adelante al mock. El mock está activo también en el sitio publicado.

**Cómo comprobarlo:** en el sitio publicado, abre las herramientas de desarrollo (pestaña *Network*). Las peticiones a `/api/...` aparecen respondidas por el service worker. Para los errores, usa el selector "Simulación de la API".

**Pruebas que lo respaldan:** `clienteHttp.test.js` usa los handlers reales del mock con `msw/node`. Comprueba las respuestas 200 de `/api/categorias` y `/api/categorias/:id/libros`, y el 404 con el mensaje del servidor para `/categorias/99/libros`.

## 2. Manejo de errores

**Implementado**
- Un único cliente HTTP (`src/services/clienteHttp.js`) lanza un error si la respuesta no es exitosa. Normaliza todos los errores a `{ tipo, estado, mensaje }` con `normalizarError` (`src/utils/errores.js`).
- Cada tipo tiene un título y un mensaje distintos: no encontrado, error del servidor, sin conexión o error inesperado. Además existe un aviso informativo para la lista vacía.
- Todos los avisos ofrecen una alternativa:
  - con 404 o un id inválido, un enlace a Categorías, porque reintentar no lo arregla;
  - con 500 o sin conexión, **Reintentar** más un enlace.
- Si un reintento falla con datos ya cargados, los datos se conservan junto al aviso.
- Las tres páginas usan el mismo componente, `AvisoErrorConsulta`.

**Cómo comprobarlo:** `/categorias/99` y `/categorias/abc` muestran "No encontrado" sin Reintentar, y `/categorias/7` muestra la lista vacía. Con el modo 500 o "Sin conexión", una categoría no visitada muestra su aviso con Reintentar.

**Pruebas que lo respaldan:**
- `errores.test.js`: un tipo por caso, el uso del mensaje del servidor y que un `TypeError` del código quede como desconocido.
- `clienteHttp.test.js`: 404, 500, sin conexión y JSON inválido dan el tipo correcto y no quedan en caché, y tras un error la petición siguiente funciona.

## 3. Control de carga

**Implementado**
- Cada petición tiene su indicador (`Cargando`, con `role="status"`), y la región que se actualiza lleva `aria-busy`. El indicador desaparece al llegar los datos o el error.
- El título de la pestaña y el h1 se muestran desde el primer momento, con un texto genérico que cambia al nombre de la categoría o del libro.
- Al reintentar se mantienen visibles los datos anteriores.
- Al cambiar de categoría, los libros anteriores no se muestran bajo el nuevo título.
- Si los datos ya están en caché, no aparece ningún indicador.

**Cómo comprobarlo:** elige "Respuesta lenta (4 s)" y abre una categoría nueva. Vuelve atrás y entra de nuevo: aparece al instante, sin indicador.

**Pruebas que lo respaldan:** el indicador depende de dos cosas que se prueban en `clienteHttp.test.js`. Una cancelación se informa con el tipo `cancelado`, que nunca se muestra como error. `leerCache` entrega al instante lo ya obtenido. Los componentes no tienen pruebas automatizadas, porque las pruebas corren en Node, sin entorno de navegador.

## 4. Optimización de consultas

**Implementado**
- Una caché en memoria por URL: lo ya obtenido no se vuelve a pedir.
- Las peticiones en curso con la misma URL se comparten, y un error nunca queda en caché.
- Cada efecto cancela su petición con `AbortController` al salir de la página o cambiar de parámetro. Esto también evita la petición duplicada del doble efecto de `StrictMode`.
- Un id inválido no genera petición, e ids equivalentes (`7` y `007`) comparten la entrada de caché.
- Se carga solo lo necesario:
  - el listado de libros no incluye la sinopsis;
  - cada página se descarga recién al visitarla (`lazy`);
  - MSW queda en un archivo propio que el navegador reutiliza desde su caché.

**Cómo comprobarlo:** en la pestaña *Network*, recorre Categorías → una categoría → un libro → Volver → Volver. Cada recurso se pide una sola vez. Con `/categorias/abc` no se hace ninguna petición a la API.

**Pruebas que lo respaldan:**
- `clienteHttp.test.js` cuenta las peticiones que llegan al mock:
  - lo cacheado no se vuelve a pedir, y `forzar` sí pide de nuevo;
  - dos consumidores simultáneos generan una sola petición;
  - si uno cancela, el otro recibe los datos sin abortar la red;
  - si cancelan ambos, la red se aborta y nada queda en caché;
  - el caso de `StrictMode` genera una sola petición.
- `ids.test.js` y `libros.test.js`: los ids inválidos dan ruta `null` (sin petición) y `7` y `007` generan la misma ruta.
