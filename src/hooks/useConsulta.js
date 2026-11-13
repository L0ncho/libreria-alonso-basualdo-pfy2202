import { useEffect, useState } from 'react'
import { leerCache, obtenerJson } from '../services/clienteHttp.js'
import { TIPOS_ERROR } from '../utils/errores.js'

// Consulta genérica a la API. Con ruta null no se hace ninguna petición (por ejemplo, un id inválido).
// Devuelve { datos, cargando, error, reintentar }:
// - Con datos en caché no hay petición ni indicador de carga.
// - Mientras carga se mantienen visibles los últimos datos obtenidos.
// - reintentar pide de nuevo al servidor aunque haya caché.
export function useConsulta(ruta) {
  // El reintento queda atado a su ruta; al cambiar de ruta deja de aplicar
  const [reintento, setReintento] = useState({ ruta: null, numero: 0 })
  // Último resultado: clave de la consulta que lo produjo, últimos datos obtenidos y error
  const [resultado, setResultado] = useState({ clave: null, datos: undefined, error: null })

  const numeroReintento = reintento.ruta === ruta ? reintento.numero : 0
  const clave = ruta === null ? null : `${ruta}#${numeroReintento}`

  // Estado derivado: nada de esto se guarda
  const enCache = ruta === null ? undefined : leerCache(ruta)
  const terminada = resultado.clave === clave
  const cargando = ruta !== null && !terminada && (numeroReintento > 0 || enCache === undefined)
  const error = terminada ? resultado.error : null
  const datos = enCache ?? (cargando ? resultado.datos : undefined)

  useEffect(() => {
    if (ruta === null) return

    const forzar = numeroReintento > 0
    if (!forzar && leerCache(ruta) !== undefined) return

    const claveConsulta = `${ruta}#${numeroReintento}`
    const controlador = new AbortController()

    obtenerJson(ruta, { signal: controlador.signal, forzar })
      .then((datosNuevos) => {
        setResultado({ clave: claveConsulta, datos: datosNuevos, error: null })
        // Terminado el reintento, la ruta vuelve a usar la caché si se visita otra vez
        if (forzar) setReintento((actual) => ({ ruta: null, numero: actual.numero }))
      })
      .catch((errorConsulta) => {
        // Una cancelación nunca se muestra como error
        if (errorConsulta.tipo === TIPOS_ERROR.cancelado) return
        setResultado((anterior) => ({ clave: claveConsulta, datos: anterior.datos, error: errorConsulta }))
      })

    return () => controlador.abort()
  }, [ruta, numeroReintento])

  function reintentar() {
    if (ruta === null) return
    setReintento((actual) => ({ ruta, numero: actual.numero + 1 }))
  }

  return { datos, cargando, error, reintentar }
}
