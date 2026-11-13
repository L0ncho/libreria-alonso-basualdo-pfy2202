import { convertirEntero } from '../utils/ids.js'

// Servicio de libros: cada ruta es a la vez la consulta y la clave de caché.
// El id llega como texto desde la URL; si no es un entero positivo la ruta es null
// y no se hace ninguna petición. Ids equivalentes ("7" y "007") dan la misma ruta

export function rutaLibrosCategoria(idCategoria) {
  const id = convertirEntero(idCategoria)
  return id === null ? null : `/categorias/${id}/libros`
}

export function rutaLibro(idLibro) {
  const id = convertirEntero(idLibro)
  return id === null ? null : `/libros/${id}`
}
