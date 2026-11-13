// Se crea una sola vez: construir un Intl.NumberFormat en cada llamada es costoso
const formatoPesos = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

// Precio en pesos chilenos: 18990 → "$18.990"
export function formatearPrecio(precio) {
  return formatoPesos.format(precio)
}

export function formatearCantidadLibros(cantidad) {
  if (cantidad === 0) return 'Sin libros por ahora'
  return cantidad === 1 ? '1 libro' : `${cantidad} libros`
}
