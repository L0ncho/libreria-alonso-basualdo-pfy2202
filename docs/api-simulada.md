# API simulada

[← Volver al README](../README.md)

La API vive en `src/mocks/` y se intercepta en el navegador con un service worker (`public/mockServiceWorker.js`, generado con `npx msw init public`). Las rutas son relativas a la base del sitio, por lo que funcionan igual en desarrollo y en GitHub Pages.

## Recursos

| Método y ruta | Respuesta 200 | 404 |
| --- | --- | --- |
| `GET /api/categorias` | Lista de categorías con `id`, `nombre`, `descripcion` y `cantidadLibros` | No aplica |
| `GET /api/categorias/:id/libros` | `{ categoria, libros }`; cada libro trae solo `id`, `titulo`, `autor`, `anio` y `precio` (sin sinopsis) | Categoría inexistente o id no numérico |
| `GET /api/libros/:id` | Libro completo con `sinopsis` y su `categoria: { id, nombre }` | Libro inexistente o id no numérico |

- Hay 7 categorías y 18 libros. **Poesía** (id 7) no tiene libros, para probar la lista vacía.
- El 404 responde con un cuerpo JSON `{ mensaje }`, por ejemplo `No existe una categoría con el id «99».`, y la interfaz muestra ese mensaje.
- Cada respuesta tarda entre 400 y 900 ms.

## Códigos y modos de simulación

| Caso | Qué responde la API | Qué muestra la interfaz |
| --- | --- | --- |
| Normal | 200 con los datos | Los datos |
| Recurso inexistente | 404 con `{ mensaje }` | "No encontrado", el mensaje y un enlace a otra sección (sin Reintentar) |
| Error del servidor (500) | 500 con `{ mensaje }` | "Error del servidor", Reintentar y un enlace |
| Sin conexión | Falla de red (`HttpResponse.error()`), sin respuesta HTTP | "Sin conexión", Reintentar y un enlace |
| Respuesta lenta (4 s) | 200 tras 4 segundos | El indicador de carga durante más tiempo |

## Cómo probar los errores

En el pie de página está el selector **"Simulación de la API"**. El modo elegido se guarda en `sessionStorage` (clave `librarte-simulacion`) y se aplica desde la siguiente petición, sin recargar la página.

Como lo ya cargado se sirve desde la caché y no vuelve a pedirse, para ver un error hay que provocar una petición nueva:

1. Elige "Error del servidor (500)" o "Sin conexión".
2. Abre una categoría o un libro que todavía no hayas visitado, o recarga la página (el modo se conserva en la pestaña).
3. Vuelve a "Normal" y pulsa **Reintentar**: los datos aparecen sin salir de la página.

Para el 404 basta con escribir una dirección inexistente, por ejemplo `/categorias/99`, `/libros/999` o `/categorias/abc`.
