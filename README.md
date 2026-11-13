# Librarte: librería con API REST simulada

Aplicación de una sola página (SPA) en React para explorar las categorías de una librería, ver los libros de cada categoría y revisar el detalle de cada libro. Los datos vienen de una API REST simulada con MSW (Mock Service Worker), que responde con demoras realistas y permite provocar errores 404, 500 y fallas de red para probar cómo reacciona la interfaz.

Actividad formativa de la semana 4 de Frontend II (PFY2202).

- **Sitio publicado:** https://l0ncho.github.io/libreria-alonso-basualdo-pfy2202/
- **Repositorio:** https://github.com/L0ncho/libreria-alonso-basualdo-pfy2202

## Revisión rápida

En el sitio publicado, con las herramientas de desarrollo abiertas en la pestaña *Network*. El selector **"Simulación de la API"** está en el pie de página:

1. **Navegar con caché:** recorre Categorías → una categoría → un libro → Volver → Volver. Cada `/api/...` se pide una sola vez, respondido por el service worker, y lo ya visitado aparece al instante, sin indicador de carga.
2. **Provocar un 404:** abre `/categorias/99` o `/libros/999`. Se muestra "No encontrado" con un enlace a Categorías y sin Reintentar. `/categorias/abc` muestra lo mismo sin hacer ninguna petición, y `/categorias/7` muestra la lista vacía.
3. **Error 500:** elige "Error del servidor (500)" y abre una categoría que no hayas visitado. Aparece el aviso con Reintentar. Vuelve a "Normal", pulsa **Reintentar** y los datos llegan sin salir de la página.
4. **Sin conexión:** repite el paso anterior con "Sin conexión". El aviso es distinto ("Sin conexión") y ofrece las mismas alternativas.
5. **Modo lento:** elige "Respuesta lenta (4 s)" y abre una categoría nueva. El título y el indicador de carga se ven de inmediato, y el indicador se retira cuando llegan los libros.

## Criterios de la pauta

| Criterio | Cómo se cumple | Detalle |
| --- | --- | --- |
| Mock REST integrado | Tres recursos con MSW, 404 con mensaje, lista vacía y modos de error 500 y sin conexión, activos también en el sitio publicado | [Ver](docs/criterios.md#1-mock-rest-integrado-por-completo) |
| Manejo de errores | Errores normalizados con un mensaje por tipo; Reintentar solo cuando sirve y siempre un enlace a otra sección | [Ver](docs/criterios.md#2-manejo-de-errores) |
| Control de carga | Un indicador por petición con `aria-busy`; datos conservados al reintentar y nunca de otra categoría | [Ver](docs/criterios.md#3-control-de-carga) |
| Optimización de consultas | Caché por URL, peticiones en curso compartidas, cancelación con `AbortController` y solo los datos necesarios | [Ver](docs/criterios.md#4-optimización-de-consultas) |

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

## Comandos

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

## Estructura

```text
public/       mockServiceWorker.js (generado por MSW) y favicon
src/
  components/ Layout, avisos, botones y tarjetas por pantalla
  hooks/      useConsulta, un hook por recurso y useVolver
  mocks/      datos, handlers, modos de simulación y setupWorker
  config/     nombre de la tienda y eslogan; styles/ clases compartidas; index.css único CSS
  pages/      una página por ruta, con carga diferida desde routes/AppRoutes.jsx
  services/   cliente HTTP con caché y rutas por recurso
  test/       configuración de Vitest y servidor de msw/node
  utils/      errores, ids y formato (funciones puras)
docs/         documentación técnica
```

## Documentación

- [Cómo se cumple cada criterio](docs/criterios.md): lo implementado, cómo comprobarlo y las pruebas que lo respaldan.
- [API simulada](docs/api-simulada.md): recursos, códigos, modos de simulación y cómo probar los errores.
- [Pruebas](docs/pruebas.md): cómo ejecutarlas, qué cubre cada archivo y cómo están armadas.
- [REST vs GraphQL](docs/rest-vs-graphql.md): diferencias, cuándo conviene cada uno y por qué se usa REST.
- [Decisiones técnicas](docs/decisiones-tecnicas.md): cada decisión con su motivo y la alternativa descartada, y las diferencias con la guía del curso.
- [Diagramas](docs/diagramas.md): recorrido de una petición, peticiones compartidas, estados de una consulta y mapa de rutas.
