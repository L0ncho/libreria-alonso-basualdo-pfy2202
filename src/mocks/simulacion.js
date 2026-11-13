// Único lugar donde se definen la clave y los modos de simulación de la API.
// Lo usan los handlers (para decidir la respuesta) y el selector del pie (para cambiar el modo)
export const CLAVE_SIMULACION = 'librarte-simulacion'

export const MODOS = {
  normal: 'normal',
  errorServidor: 'error-servidor',
  sinConexion: 'sin-conexion',
  lenta: 'lenta',
}

export const OPCIONES_SIMULACION = [
  { valor: MODOS.normal, etiqueta: 'Normal' },
  { valor: MODOS.errorServidor, etiqueta: 'Error del servidor (500)' },
  { valor: MODOS.sinConexion, etiqueta: 'Sin conexión' },
  { valor: MODOS.lenta, etiqueta: 'Respuesta lenta (4 s)' },
]

const valoresValidos = new Set(Object.values(MODOS))

// Si no hay modo guardado, no es válido o sessionStorage no está disponible, se usa "normal"
export function leerModoSimulacion() {
  try {
    const guardado = sessionStorage.getItem(CLAVE_SIMULACION)
    return valoresValidos.has(guardado) ? guardado : MODOS.normal
  } catch {
    return MODOS.normal
  }
}

export function guardarModoSimulacion(modo) {
  if (!valoresValidos.has(modo)) return
  try {
    sessionStorage.setItem(CLAVE_SIMULACION, modo)
  } catch {
    // Sin acceso a sessionStorage: la simulación queda en modo normal
  }
}
