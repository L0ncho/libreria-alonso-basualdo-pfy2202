# Diagramas

Los diagramas usan Mermaid; GitHub los muestra directamente al abrir este archivo.

## 1. Recorrido de una petición

Ejemplo: la página de libros de una categoría. Las páginas nunca llaman a `fetch`: usan un hook, que usa el servicio y el cliente HTTP.

```mermaid
flowchart TD
  P["LibrosCategoria<br/>useParams → id"] --> H["useLibrosCategoria(id)"]
  H --> S["rutaLibrosCategoria(id)<br/>convertirEntero"]
  S -->|id inválido: ruta null| N["Sin petición<br/>la página muestra «No encontrado»"]
  S -->|"/categorias/3/libros"| C["useConsulta(ruta)"]
  C -->|"leerCache: hay datos"| D["Datos al instante<br/>sin indicador de carga"]
  C -->|sin datos o Reintentar| O["obtenerJson(ruta, { signal, forzar })"]
  O -->|en caché y sin forzar| D
  O -->|misma URL en curso| E["Se une a la petición en curso<br/>consumidores + 1"]
  O -->|nueva| F["fetch(BASE_URL + 'api' + ruta)"]
  E --> F
  F --> W["Service worker de MSW<br/>handlers.js: demora 400-900 ms"]
  W -->|200| OK["Respuesta JSON<br/>se guarda en caché"]
  W -->|"404 / 500"| ER["response.ok falso<br/>normalizarError → no-encontrado / servidor"]
  W -->|"HttpResponse.error()"| RED["fetch rechaza<br/>normalizarError → red"]
  OK --> R["useConsulta: datos"]
  ER --> X["useConsulta: error<br/>no se guarda en caché"]
  RED --> X
  R --> H2["El hook entrega los datos<br/>solo si son de la ruta pedida"]
  H2 --> P
  X --> A["AvisoErrorConsulta<br/>Reintentar o solo enlace"]
```

## 2. Dos consumidores que comparten una petición

El consumidor B pide la misma URL mientras la petición de A sigue en curso. Hay una sola petición de red, y cada consumidor recibe su propia promesa.

```mermaid
sequenceDiagram
  participant A as Consumidor A
  participant B as Consumidor B
  participant C as clienteHttp
  participant W as MSW

  A->>C: obtenerJson("/categorias", { signal: a })
  C->>C: sin caché ni petición en curso: crearPeticion
  C->>W: fetch(.../api/categorias)
  Note over C: enCurso tiene la URL, consumidores = 1
  B->>C: obtenerJson("/categorias", { signal: b })
  C->>C: encuentra la petición en curso
  Note over C: consumidores = 2, no hay segundo fetch
  W-->>C: 200 con la lista
  C->>C: cache.set(url, datos) y enCurso.delete(url)
  C-->>A: datos (promesa de A)
  C-->>B: datos (promesa de B)
  Note over A,B: Si A cancela antes de la respuesta, solo se rechaza su promesa (cancelado),<br/>consumidores = 1 y la petición sigue para B. El fetch se aborta recién<br/>si el contador queda en 0 después de una microtarea (StrictMode).
```

## 3. Estados de una consulta

Estados que ve una página que usa `useConsulta`. "Cargando con datos" es el reintento: los datos anteriores siguen visibles.

```mermaid
stateDiagram-v2
  [*] --> SinPeticion: id inválido (ruta null)
  [*] --> Datos: ya está en caché
  [*] --> Cargando: no está en caché

  Cargando --> Datos: 200 con elementos
  Cargando --> Vacio: 200 con lista vacía
  Cargando --> ErrorNoEncontrado: 404
  Cargando --> ErrorReintentable: 500, red o desconocido

  ErrorReintentable --> Cargando: Reintentar
  Datos --> CargandoConDatos: Reintentar
  CargandoConDatos --> Datos: 200
  CargandoConDatos --> DatosConError: error

  SinPeticion: Sin petición, aviso No encontrado
  Vacio: Lista vacía, aviso informativo y enlace
  ErrorNoEncontrado: No encontrado, solo enlace
  ErrorReintentable: Reintentar y enlace
  DatosConError: Datos conservados y aviso de error
```

Al cambiar de parámetro (otra categoría u otro libro), la consulta anterior se cancela y la nueva parte desde el inicio. Los datos de la consulta anterior no se muestran bajo el nuevo título.

## 4. Mapa de rutas

Todas las páginas están dentro de `Layout` y se cargan de forma diferida; el `Suspense` envuelve solo el `Outlet`, así que el encabezado y el pie siguen visibles mientras se descarga una página.

```mermaid
flowchart LR
  L["Layout<br/>encabezado, Suspense + Outlet, pie con selector de simulación"]
  L --> I["/<br/>Inicio"]
  L --> C["/categorias<br/>Categorías<br/>GET /api/categorias"]
  L --> LC["/categorias/:id<br/>LibrosCategoria<br/>GET /api/categorias/:id/libros"]
  L --> D["/libros/:id<br/>DetalleLibro<br/>GET /api/libros/:id"]
  L --> NE["*<br/>NoEncontrado"]

  I -->|Ver categorías| C
  C -->|tarjeta| LC
  LC -->|tarjeta de libro| D
  D -->|enlace a su categoría| LC
  LC -.->|"Volver: atrás o /categorias"| C
  D -.->|"Volver: atrás o /categorias/:id"| LC
  NE -.->|"Volver: atrás o /"| I
```

"Volver" usa `useVolver(rutaDeRespaldo)`: navega hacia atrás si la página anterior es del sitio (`location.key !== "default"`); si se entró directo, va a la ruta de respaldo.
