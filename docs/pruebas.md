# Pruebas

[← Volver al README](../README.md)

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
