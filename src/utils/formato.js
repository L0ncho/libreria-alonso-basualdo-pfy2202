export function formatearCantidadLibros(cantidad) {
  if (cantidad === 0) return 'Sin libros por ahora'
  return cantidad === 1 ? '1 libro' : `${cantidad} libros`
}
