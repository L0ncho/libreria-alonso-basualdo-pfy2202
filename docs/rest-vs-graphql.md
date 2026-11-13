# REST vs GraphQL

[← Volver al README](../README.md)

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
