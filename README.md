# Librarte: librería con API REST simulada

Aplicación de una sola página (SPA) en React para explorar las categorías de una librería, ver los libros de cada categoría y revisar el detalle de cada libro. Los datos vienen de una API REST simulada con MSW (Mock Service Worker), que responde con demoras realistas y permite provocar errores 404, 500 y fallas de red para probar cómo reacciona la interfaz.

Actividad formativa de la semana 4 de Frontend II (PFY2202).

- **Sitio publicado:** https://l0ncho.github.io/libreria-alonso-basualdo-pfy2202/
- **Repositorio:** https://github.com/L0ncho/libreria-alonso-basualdo-pfy2202

## Stack

| Herramienta | Versión | Uso |
| --- | --- | --- |
| React | 19.3 | Interfaz |
| React Router | 8.5 (paquete `react-router`) | Rutas en modo declarativo con `BrowserRouter` |
| Vite | 8.3 | Servidor de desarrollo y compilación |
| Tailwind CSS | 4.3 (con `@tailwindcss/vite`) | Estilos, sin `tailwind.config.js` ni PostCSS |
| MSW | 2.15 | API REST simulada en el navegador |
| ESLint | 10.14 | Revisión del código |
| gh-pages | 6.3 | Publicación de `dist` en la rama `gh-pages` |
| Vitest | 5.1 | Pruebas automatizadas |

Las peticiones usan `fetch` nativo y una caché propia (sin axios ni TanStack Query). Requiere Node 22.22 o superior.

## Cómo ejecutar, compilar y publicar

```bash
npm install        # instala las dependencias
npm run dev        # servidor de desarrollo en http://localhost:5173/
npm run lint       # revisa el código con ESLint
npm run test       # ejecuta las pruebas con Vitest (una sola pasada)
npm run build      # compila en dist/ con la base /libreria-alonso-basualdo-pfy2202/
npm run preview    # sirve dist/ en http://localhost:4173/libreria-alonso-basualdo-pfy2202/
npm run deploy     # compila (predeploy) y publica dist/ en la rama gh-pages
```

Sobre la publicación en GitHub Pages:

- En desarrollo la base es `/`; al compilar y en `npm run preview` es `/libreria-alonso-basualdo-pfy2202/`, la subcarpeta donde GitHub Pages publica el repositorio. Así `preview` reproduce el sitio publicado, con el service worker y la API bajo la misma ruta.
- Un plugin propio del build (en `vite.config.js`) copia `dist/index.html` como `dist/404.html`. GitHub Pages responde con ese archivo cuando se recarga una ruta interna como `/categorias/3`; la SPA carga y React Router muestra la página correcta.
- En el repositorio, *Settings → Pages* debe publicar desde la rama `gh-pages`, carpeta raíz.

## API simulada

La API vive en `src/mocks/` y se intercepta en el navegador con un service worker (`public/mockServiceWorker.js`, generado con `npx msw init public`). Las rutas son relativas a la base del sitio, por lo que funcionan igual en desarrollo y en GitHub Pages.

### Recursos

| Método y ruta | Respuesta 200 | 404 |
| --- | --- | --- |
| `GET /api/categorias` | Lista de categorías con `id`, `nombre`, `descripcion` y `cantidadLibros` | No aplica |
| `GET /api/categorias/:id/libros` | `{ categoria, libros }`; cada libro trae solo `id`, `titulo`, `autor`, `anio` y `precio` (sin sinopsis) | Categoría inexistente o id no numérico |
| `GET /api/libros/:id` | Libro completo con `sinopsis` y su `categoria: { id, nombre }` | Libro inexistente o id no numérico |

- Hay 7 categorías y 18 libros. **Poesía** (id 7) no tiene libros, para probar la lista vacía.
- El 404 responde con un cuerpo JSON `{ mensaje }`, por ejemplo `No existe una categoría con el id «99».`, y la interfaz muestra ese mensaje.
- Cada respuesta tarda entre 400 y 900 ms.

### Códigos y modos de simulación

| Caso | Qué responde la API | Qué muestra la interfaz |
| --- | --- | --- |
| Normal | 200 con los datos | Los datos |
| Recurso inexistente | 404 con `{ mensaje }` | "No encontrado", el mensaje y un enlace a otra sección (sin Reintentar) |
| Error del servidor (500) | 500 con `{ mensaje }` | "Error del servidor", Reintentar y un enlace |
| Sin conexión | Falla de red (`HttpResponse.error()`), sin respuesta HTTP | "Sin conexión", Reintentar y un enlace |
| Respuesta lenta (4 s) | 200 tras 4 segundos | El indicador de carga durante más tiempo |

### Cómo probar los errores

En el pie de página está el selector **"Simulación de la API"**. El modo elegido se guarda en `sessionStorage` (clave `librarte-simulacion`) y se aplica desde la siguiente petición, sin recargar la página.

Como lo ya cargado se sirve desde la caché y no vuelve a pedirse, para ver un error hay que provocar una petición nueva:

1. Elige "Error del servidor (500)" o "Sin conexión".
2. Abre una categoría o un libro que todavía no hayas visitado, o recarga la página (el modo se conserva en la pestaña).
3. Vuelve a "Normal" y pulsa **Reintentar**: los datos aparecen sin salir de la página.

Para el 404 basta con escribir una dirección inexistente, por ejemplo `/categorias/99`, `/libros/999` o `/categorias/abc`.

## Cómo se cumple cada criterio

### 1. Mock REST integrado por completo

**Implementado**
- Tres recursos REST con MSW (`src/mocks/handlers.js`) y datos separados en `src/mocks/datos.js`.
- 404 con mensaje propio, una categoría sin libros, un modo para el error 500 y otro para la falla de red.
- `main.jsx` espera a que el worker inicie antes de renderizar, para que ninguna petición se adelante al mock. El mock está activo también en el sitio publicado.

**Cómo comprobarlo:** en el sitio publicado, abre las herramientas de desarrollo (pestaña *Network*). Las peticiones a `/api/...` aparecen respondidas por el service worker. Para los errores, usa el selector "Simulación de la API".

**Pruebas que lo respaldan:** `clienteHttp.test.js` usa los handlers reales del mock con `msw/node`. Comprueba las respuestas 200 de `/api/categorias` y `/api/categorias/:id/libros`, y el 404 con el mensaje del servidor para `/categorias/99/libros`.

### 2. Manejo de errores

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

### 3. Control de carga

**Implementado**
- Cada petición tiene su indicador (`Cargando`, con `role="status"`), y la región que se actualiza lleva `aria-busy`. El indicador desaparece al llegar los datos o el error.
- El título de la pestaña y el h1 se muestran desde el primer momento, con un texto genérico que cambia al nombre de la categoría o del libro.
- Al reintentar se mantienen visibles los datos anteriores.
- Al cambiar de categoría, los libros anteriores no se muestran bajo el nuevo título.
- Si los datos ya están en caché, no aparece ningún indicador.

**Cómo comprobarlo:** elige "Respuesta lenta (4 s)" y abre una categoría nueva. Vuelve atrás y entra de nuevo: aparece al instante, sin indicador.

**Pruebas que lo respaldan:** el indicador depende de dos cosas que se prueban en `clienteHttp.test.js`. Una cancelación se informa con el tipo `cancelado`, que nunca se muestra como error. `leerCache` entrega al instante lo ya obtenido. Los componentes no tienen pruebas automatizadas, porque las pruebas corren en Node, sin entorno de navegador.

### 4. Optimización de consultas

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

## Pruebas

Las pruebas usan Vitest y corren en Node, sin navegador:

```bash
npm run test
```

| Archivo | Qué cubre |
| --- | --- |
| `src/utils/ids.test.js` | `convertirEntero`: `"7"` y `"007"` dan 7; `"0"`, `"-1"`, `"1.5"`, `"1e3"`, `" 7"`, `"abc"`, `""` y `null` dan `null` |
| `src/utils/errores.test.js` | `normalizarError` con cada tipo (red, no-encontrado, servidor, cancelado, desconocido), el mensaje del servidor cuando viene, el `TypeError` del código como desconocido, `errorIdInvalido` y `tituloError` |
| `src/utils/formato.test.js` | `formatearPrecio` en pesos chilenos (`$18.990`) y `formatearCantidadLibros` |
| `src/services/libros.test.js` | Rutas de los servicios: ids inválidos dan `null`, ids equivalentes dan la misma ruta |
| `src/services/clienteHttp.test.js` | Caché, `forzar`, peticiones compartidas, cancelación (uno o ambos consumidores), el caso de `StrictMode`, y 404, 500, sin conexión y JSON inválido sin quedar en caché |

**Cómo están armadas**

- **Mock real:** las pruebas del cliente usan los mismos handlers del sitio con `msw/node` (`src/test/servidor.js`). Los errores se provocan reemplazando una respuesta con `server.use`. Cuentan las peticiones que llegan al mock con el evento `request:start` y revisan su `signal` para saber si la red se abortó.
- **Rutas relativas en Node:** en Node no existe `location`. `src/test/configuracion.js` la define como `http://localhost/` para que `/api/...` se resuelva igual que en el navegador, sin cambiar el código de la aplicación.
- **Caché vacía en cada prueba:** cada prueba importa una copia nueva del cliente con `vi.resetModules()`, así empieza con la caché vacía sin agregar una función solo para pruebas.
- **Duración:** el mock responde con su demora real (400 a 900 ms), por lo que la suite tarda unos 10 segundos.

## REST vs GraphQL

| | REST | GraphQL |
| --- | --- | --- |
| Forma de la API | Varios recursos, cada uno con su URL (`/api/libros/1`) | Un único endpoint que recibe consultas |
| Qué datos llegan | Los que define el servidor para cada recurso | Exactamente los campos que pide el cliente |
| Caché | Natural por URL, también la del navegador y la de HTTP | Requiere un cliente con caché normalizada (por ejemplo Apollo), porque todo pasa por la misma URL con POST |
| Errores | Códigos HTTP (404, 500) | Por lo general responde 200 con una lista `errors` en el cuerpo |
| Complejidad inicial | Baja: `fetch` basta | Mayor: esquema, resolvers y cliente especializado |

**Cuándo conviene cada uno**
- **REST** sirve para recursos bien delimitados, pantallas que piden lo mismo que entrega cada recurso y casos en que importa aprovechar la caché por URL y los códigos HTTP.
- **GraphQL** sirve cuando muchas pantallas necesitan combinaciones distintas de datos relacionados, cuando hay varios clientes (web, móvil) con necesidades diferentes o cuando se quiere evitar pedir de más o encadenar varias peticiones.

**Por qué este proyecto usa REST:** los recursos son pocos y claros, y cada pantalla corresponde a un recurso. La pauta evalúa el manejo de 404 y 500, y la caché por URL es simple y suficiente. Además, el listado ya se diseñó para traer solo lo que muestra.

## Diferencias con la guía del curso

| Guía | Este proyecto | Motivo |
| --- | --- | --- |
| Create React App | Vite | Create React App está descontinuado; Vite es la herramienta recomendada hoy y compila mucho más rápido |
| `react-router-dom` | `react-router` | Desde la versión 7 todo se importa desde `react-router`; en la versión 8 `react-router-dom` ya no existe |
| `process.env` | `import.meta.env` | Vite expone las variables de entorno con `import.meta.env` (por ejemplo `BASE_URL` y `DEV`) |
| MSW en `devDependencies`, activo solo en desarrollo | MSW en `dependencies` y activo también en producción | El sitio publicado en GitHub Pages no tiene backend: sin el mock, la versión publicada no tendría datos |

## Estructura

```text
public/                 mockServiceWorker.js (generado por MSW) y favicon
src/
  components/           Layout, Boton, Aviso, AvisoErrorConsulta, Cargando, TituloPagina,
                        BotonTema, VolverArriba, SelectorSimulacion y tarjetas por pantalla
  config/sitio.js       nombre de la tienda y eslogan
  hooks/                useConsulta (genérico), un hook por recurso y useVolver
  mocks/                datos.js, handlers.js, simulacion.js y browser.js (setupWorker)
  pages/                una página por ruta
  routes/AppRoutes.jsx  rutas con carga diferida
  services/             clienteHttp.js (caché y peticiones compartidas) y rutas por recurso
  styles/clases.js      clases de Tailwind compartidas
  test/                 configuración de Vitest y servidor de msw/node
  utils/                errores.js, ids.js y formato.js
  index.css             único CSS: Tailwind, paleta y modo oscuro
docs/
  decisiones-tecnicas.md
  diagramas.md
```

## Documentación técnica

- [Decisiones técnicas](docs/decisiones-tecnicas.md): cada decisión con su motivo y la alternativa descartada.
- [Diagramas](docs/diagramas.md): recorrido de una petición, peticiones compartidas, estados de una consulta y mapa de rutas.
