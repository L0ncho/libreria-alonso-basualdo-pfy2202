// Datos de la API simulada. Precios en pesos chilenos (enteros).
// Poesía es la única categoría sin libros, para probar la lista vacía
export const categorias = [
  {
    id: 1,
    nombre: 'Ficción',
    descripcion: 'Novelas y relatos que exploran la experiencia humana.',
  },
  {
    id: 2,
    nombre: 'Ciencia Ficción',
    descripcion: 'Futuros posibles, viajes espaciales y tecnologías que cambian el mundo.',
  },
  {
    id: 3,
    nombre: 'Fantasía',
    descripcion: 'Mundos imaginarios, magia y aventuras épicas.',
  },
  {
    id: 4,
    nombre: 'Misterio y Suspenso',
    descripcion: 'Crímenes, enigmas e investigaciones que mantienen la tensión hasta el final.',
  },
  {
    id: 5,
    nombre: 'Historia',
    descripcion: 'Relatos y análisis de los hechos que dieron forma a nuestras sociedades.',
  },
  {
    id: 6,
    nombre: 'Divulgación Científica',
    descripcion: 'La ciencia explicada con claridad para cualquier lector curioso.',
  },
  {
    id: 7,
    nombre: 'Poesía',
    descripcion: 'Versos clásicos y contemporáneos para leer con calma.',
  },
]

export const libros = [
  {
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    anio: 1967,
    precio: 18990,
    categoriaId: 1,
    sinopsis:
      'Siete generaciones de la familia Buendía viven amores, guerras y prodigios en el pueblo de Macondo.',
  },
  {
    id: 2,
    titulo: 'La casa de los espíritus',
    autor: 'Isabel Allende',
    anio: 1982,
    precio: 16990,
    categoriaId: 1,
    sinopsis:
      'La historia de tres generaciones de mujeres de la familia Trueba, marcada por la clarividencia, la pasión y los cambios políticos de su país.',
  },
  {
    id: 3,
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    anio: 1963,
    precio: 15990,
    categoriaId: 1,
    sinopsis:
      'Horacio Oliveira busca sentido entre París y Buenos Aires en una novela que puede leerse en más de un orden.',
  },
  {
    id: 4,
    titulo: 'Fundación',
    autor: 'Isaac Asimov',
    anio: 1951,
    precio: 15990,
    categoriaId: 2,
    sinopsis:
      'Un matemático predice la caída del Imperio Galáctico y traza un plan para acortar la oscuridad que vendrá.',
  },
  {
    id: 5,
    titulo: 'Dune',
    autor: 'Frank Herbert',
    anio: 1965,
    precio: 21990,
    categoriaId: 2,
    sinopsis:
      'En el desértico planeta Arrakis, el joven Paul Atreides queda en el centro de una lucha por el recurso más valioso del universo.',
  },
  {
    id: 6,
    titulo: 'Fahrenheit 451',
    autor: 'Ray Bradbury',
    anio: 1953,
    precio: 12990,
    categoriaId: 2,
    sinopsis:
      'Un bombero encargado de quemar libros empieza a preguntarse qué guardan las páginas que destruye.',
  },
  {
    id: 7,
    titulo: 'El hobbit',
    autor: 'J. R. R. Tolkien',
    anio: 1937,
    precio: 14990,
    categoriaId: 3,
    sinopsis:
      'Bilbo Bolsón deja la comodidad de su hogar para acompañar a un grupo de enanos que quiere recuperar su tesoro de manos de un dragón.',
  },
  {
    id: 8,
    titulo: 'Un mago de Terramar',
    autor: 'Ursula K. Le Guin',
    anio: 1968,
    precio: 13990,
    categoriaId: 3,
    sinopsis:
      'Un joven aprendiz de mago libera por orgullo una sombra y debe recorrer el archipiélago para enfrentarla.',
  },
  {
    id: 9,
    titulo: 'El nombre del viento',
    autor: 'Patrick Rothfuss',
    anio: 2007,
    precio: 22990,
    categoriaId: 3,
    sinopsis:
      'Kvothe, ya convertido en leyenda, cuenta su propia historia: una infancia trágica, la universidad y la búsqueda de la verdad.',
  },
  {
    id: 10,
    titulo: 'Asesinato en el Orient Express',
    autor: 'Agatha Christie',
    anio: 1934,
    precio: 12990,
    categoriaId: 4,
    sinopsis:
      'Un tren queda detenido por la nieve y Hércules Poirot debe descubrir quién de los pasajeros cometió un crimen.',
  },
  {
    id: 11,
    titulo: 'El nombre de la rosa',
    autor: 'Umberto Eco',
    anio: 1980,
    precio: 19990,
    categoriaId: 4,
    sinopsis:
      'En una abadía medieval, un fraile y su discípulo investigan una serie de muertes ligadas a una biblioteca secreta.',
  },
  {
    id: 12,
    titulo: 'La sombra del viento',
    autor: 'Carlos Ruiz Zafón',
    anio: 2001,
    precio: 17990,
    categoriaId: 4,
    sinopsis:
      'En la Barcelona de posguerra, un joven sigue la pista de un autor olvidado cuyos libros alguien está destruyendo.',
  },
  {
    id: 13,
    titulo: 'Sapiens: de animales a dioses',
    autor: 'Yuval Noah Harari',
    anio: 2011,
    precio: 23990,
    categoriaId: 5,
    sinopsis:
      'Un recorrido por la historia de la humanidad, desde los primeros grupos de cazadores hasta las sociedades actuales.',
  },
  {
    id: 14,
    titulo: 'Las venas abiertas de América Latina',
    autor: 'Eduardo Galeano',
    anio: 1971,
    precio: 16990,
    categoriaId: 5,
    sinopsis:
      'Un ensayo sobre cinco siglos de explotación de los recursos y los pueblos del continente.',
  },
  {
    id: 15,
    titulo: 'SPQR: una historia de la antigua Roma',
    autor: 'Mary Beard',
    anio: 2015,
    precio: 21990,
    categoriaId: 5,
    sinopsis:
      'Cómo una pequeña aldea a orillas del Tíber llegó a gobernar un imperio, contado desde sus fuentes.',
  },
  {
    id: 16,
    titulo: 'Cosmos',
    autor: 'Carl Sagan',
    anio: 1980,
    precio: 18990,
    categoriaId: 6,
    sinopsis:
      'Un viaje por el universo y por la historia de la ciencia, desde las estrellas hasta el origen de la vida.',
  },
  {
    id: 17,
    titulo: 'Breve historia del tiempo',
    autor: 'Stephen Hawking',
    anio: 1988,
    precio: 14990,
    categoriaId: 6,
    sinopsis:
      'Agujeros negros, el origen del universo y la naturaleza del tiempo explicados sin fórmulas complicadas.',
  },
  {
    id: 18,
    titulo: 'El gen egoísta',
    autor: 'Richard Dawkins',
    anio: 1976,
    precio: 17990,
    categoriaId: 6,
    sinopsis:
      'Una mirada a la evolución desde los genes, que ayuda a entender la cooperación y el egoísmo en los seres vivos.',
  },
]
