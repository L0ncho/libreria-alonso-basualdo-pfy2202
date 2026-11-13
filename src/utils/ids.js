// Convierte un id recibido como texto (parámetro de ruta o de la URL) en un entero positivo.
// Solo acepta dígitos, mayor que 0 y dentro del rango de enteros seguros; si no, devuelve null.
// "7" y "007" dan 7; "0", "-1", "1.5", "1e3", " 7" y "abc" dan null
export function convertirEntero(valor) {
  if (typeof valor !== 'string' && typeof valor !== 'number') return null

  const texto = String(valor)
  if (!/^\d+$/.test(texto)) return null

  const numero = Number(texto)
  return Number.isSafeInteger(numero) && numero > 0 ? numero : null
}
