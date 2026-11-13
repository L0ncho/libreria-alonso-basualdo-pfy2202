import { useConsulta } from './useConsulta.js'
import { rutaLibrosCategoria } from '../services/libros.js'

// Libros de una categoría: { categoria, libros }.
// useConsulta mantiene los datos anteriores mientras carga; aquí solo se entregan si son de la
// categoría pedida, para no mostrar nunca libros de otra categoría bajo el título de la actual.
// Al reintentar la misma categoría los datos siguen visibles
export function useLibrosCategoria(idCategoria) {
  const ruta = rutaLibrosCategoria(idCategoria)
  const { datos, ...consulta } = useConsulta(ruta)

  const sonDeEstaRuta = datos !== undefined && rutaLibrosCategoria(datos.categoria?.id) === ruta

  return { ...consulta, datos: sonDeEstaRuta ? datos : undefined, idInvalido: ruta === null }
}
