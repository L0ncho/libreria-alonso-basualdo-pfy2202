// Normalización de errores de la API a { tipo, estado, mensaje }.
// tipo: red | no-encontrado | servidor | cancelado | desconocido
export const TIPOS_ERROR = {
  red: 'red',
  noEncontrado: 'no-encontrado',
  servidor: 'servidor',
  cancelado: 'cancelado',
  desconocido: 'desconocido',
}

const MENSAJES = {
  red: 'No pudimos conectarnos con la tienda. Revisa tu conexión a internet e intenta nuevamente.',
  noEncontrado: 'No encontramos lo que buscas.',
  servidor: 'El servidor tuvo un problema. Intenta nuevamente en unos momentos.',
  cancelado: 'La consulta se canceló.',
  formatoInvalido: 'La respuesta del servidor no tiene un formato válido.',
  desconocido: 'Ocurrió un error inesperado. Intenta nuevamente.',
}

const TITULOS = {
  [TIPOS_ERROR.red]: 'Sin conexión',
  [TIPOS_ERROR.noEncontrado]: 'No encontrado',
  [TIPOS_ERROR.servidor]: 'Error del servidor',
  [TIPOS_ERROR.desconocido]: 'Error inesperado',
}

const tiposValidos = new Set(Object.values(TIPOS_ERROR))

function crear(tipo, estado, mensaje) {
  return { tipo, estado, mensaje }
}

function esNormalizado(error) {
  return typeof error === 'object' && error !== null && tiposValidos.has(error.tipo)
}

function mensajeOPorDefecto(mensaje, porDefecto) {
  return typeof mensaje === 'string' && mensaje.trim() !== '' ? mensaje : porDefecto
}

// Acepta:
// - un error ya normalizado (se devuelve igual)
// - { red: true }: el cliente HTTP lo usa solo cuando fetch rechaza (falla de red)
// - { estado, mensaje }: respuesta HTTP no exitosa; si el servidor envió un mensaje, se usa ese
// - un AbortError (cancelación) o un SyntaxError (JSON inválido)
// Cualquier otro error, incluido un TypeError del propio código, queda como "desconocido"
// para no pedir al usuario que revise su conexión ante un error de programación
export function normalizarError(error) {
  if (esNormalizado(error)) return error

  if (error?.name === 'AbortError') {
    return crear(TIPOS_ERROR.cancelado, null, MENSAJES.cancelado)
  }

  if (error?.red === true) {
    return crear(TIPOS_ERROR.red, null, MENSAJES.red)
  }

  if (Number.isInteger(error?.estado)) {
    const { estado, mensaje } = error
    if (estado === 404) {
      return crear(TIPOS_ERROR.noEncontrado, estado, mensajeOPorDefecto(mensaje, MENSAJES.noEncontrado))
    }
    if (estado >= 500) {
      return crear(TIPOS_ERROR.servidor, estado, mensajeOPorDefecto(mensaje, MENSAJES.servidor))
    }
    return crear(
      TIPOS_ERROR.desconocido,
      estado,
      mensajeOPorDefecto(mensaje, `Ocurrió un error inesperado (código ${estado}). Intenta nuevamente.`),
    )
  }

  if (error instanceof SyntaxError) {
    return crear(TIPOS_ERROR.desconocido, null, MENSAJES.formatoInvalido)
  }

  return crear(TIPOS_ERROR.desconocido, null, MENSAJES.desconocido)
}

// Título corto para mostrar sobre el mensaje de error
export function tituloError(tipo) {
  return TITULOS[tipo] ?? TITULOS[TIPOS_ERROR.desconocido]
}
