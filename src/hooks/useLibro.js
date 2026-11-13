import { useConsulta } from './useConsulta.js'
import { rutaLibro } from '../services/libros.js'

// Detalle de un libro. Igual que en useLibrosCategoria, los datos anteriores solo se entregan
// si corresponden al libro pedido
export function useLibro(idLibro) {
  const ruta = rutaLibro(idLibro)
  const { datos, ...consulta } = useConsulta(ruta)

  const sonDeEstaRuta = datos !== undefined && rutaLibro(datos.id) === ruta

  return { ...consulta, datos: sonDeEstaRuta ? datos : undefined, idInvalido: ruta === null }
}
