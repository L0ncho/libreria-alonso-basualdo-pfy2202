import { normalizarError } from '../utils/errores.js'

// Cliente HTTP único de la aplicación.
// - Caché en memoria por URL: lo ya obtenido no se vuelve a pedir (salvo con forzar).
// - Peticiones en curso compartidas: varios consumidores de la misma URL esperan una sola
//   petición de red.
// - Cancelación por consumidor: cada uno pasa su signal; al cancelar, solo se rechaza su promesa.
//   La petición de red se aborta cuando ya no queda ningún consumidor esperándola.
// - Un error nunca se guarda en caché.

// Relativa a la base del sitio, para que funcione también en GitHub Pages
const BASE_API = `${import.meta.env.BASE_URL}api`

const cache = new Map()
const enCurso = new Map()

function construirUrl(ruta) {
  return `${BASE_API}${ruta}`
}

function errorCancelado() {
  return normalizarError(new DOMException('La consulta se canceló.', 'AbortError'))
}

// Lectura síncrona: permite saber en el primer render si hay datos y evitar el indicador de carga
export function leerCache(ruta) {
  return cache.get(construirUrl(ruta))
}

async function leerMensaje(respuesta) {
  try {
    const cuerpo = await respuesta.json()
    return typeof cuerpo?.mensaje === 'string' ? cuerpo.mensaje : undefined
  } catch {
    return undefined
  }
}

async function pedir(url, signal) {
  let respuesta
  try {
    respuesta = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    // Solo el rechazo de fetch se considera falla de red
    throw normalizarError(error?.name === 'AbortError' ? error : { red: true })
  }

  if (!respuesta.ok) {
    throw normalizarError({ estado: respuesta.status, mensaje: await leerMensaje(respuesta) })
  }

  try {
    return await respuesta.json()
  } catch (error) {
    throw normalizarError(error)
  }
}

function crearPeticion(url) {
  const peticion = { controlador: new AbortController(), consumidores: 0, promesa: null }

  peticion.promesa = pedir(url, peticion.controlador.signal)
    .then((datos) => {
      cache.set(url, datos)
      return datos
    })
    .finally(() => {
      if (enCurso.get(url) === peticion) enCurso.delete(url)
    })
  // Cada consumidor recibe el error en su propia promesa; esto evita un rechazo sin manejar
  // cuando la petición se aborta porque ya nadie la espera
  peticion.promesa.catch(() => {})

  enCurso.set(url, peticion)
  return peticion
}

// El abort se difiere a una microtarea: en StrictMode React desmonta y vuelve a montar el efecto
// en la misma tarea, y así el segundo montaje se une a la petición en curso en vez de repetirla
function soltar(url, peticion) {
  peticion.consumidores -= 1
  if (peticion.consumidores > 0) return

  queueMicrotask(() => {
    if (peticion.consumidores === 0 && enCurso.get(url) === peticion) {
      enCurso.delete(url)
      peticion.controlador.abort()
    }
  })
}

// Devuelve los datos de la ruta. Opciones:
// - signal: cancela la espera de este consumidor (se rechaza con tipo "cancelado")
// - forzar: ignora la caché y pide los datos de nuevo (se une a una petición en curso si existe)
export function obtenerJson(ruta, { signal, forzar = false } = {}) {
  const url = construirUrl(ruta)

  if (signal?.aborted) return Promise.reject(errorCancelado())
  if (!forzar && cache.has(url)) return Promise.resolve(cache.get(url))

  const peticion = enCurso.get(url) ?? crearPeticion(url)
  peticion.consumidores += 1

  return new Promise((resolver, rechazar) => {
    let pendiente = true

    function alCancelar() {
      if (!pendiente) return
      pendiente = false
      rechazar(errorCancelado())
      soltar(url, peticion)
    }

    signal?.addEventListener('abort', alCancelar, { once: true })

    peticion.promesa
      .then(
        (datos) => {
          if (!pendiente) return
          pendiente = false
          resolver(datos)
        },
        (error) => {
          if (!pendiente) return
          pendiente = false
          rechazar(error)
        },
      )
      .finally(() => signal?.removeEventListener('abort', alCancelar))
  })
}
