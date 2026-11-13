import { delay, http, HttpResponse } from 'msw'
import { categorias, libros } from './datos.js'
import { leerModoSimulacion, MODOS } from './simulacion.js'
import { convertirEntero } from '../utils/ids.js'

// Relativa a la base del sitio, para que funcione también en GitHub Pages
const API = `${import.meta.env.BASE_URL}api`

const DEMORA_MINIMA = 400
const DEMORA_MAXIMA = 900
const DEMORA_LENTA = 4000

function demoraNormal() {
  return DEMORA_MINIMA + Math.floor(Math.random() * (DEMORA_MAXIMA - DEMORA_MINIMA + 1))
}

// Simula la red en cada petición: lee el modo, espera la demora y, si el modo es de falla,
// devuelve la respuesta de error. Devuelve null cuando la petición debe responderse normal
async function simularRed() {
  const modo = leerModoSimulacion()
  await delay(modo === MODOS.lenta ? DEMORA_LENTA : demoraNormal())

  if (modo === MODOS.sinConexion) {
    return HttpResponse.error()
  }
  if (modo === MODOS.errorServidor) {
    return HttpResponse.json(
      { mensaje: 'El servidor tuvo un problema. Intenta nuevamente en unos momentos.' },
      { status: 500 },
    )
  }
  return null
}

function noEncontrado(mensaje) {
  return HttpResponse.json({ mensaje }, { status: 404 })
}

function buscarCategoria(idTexto) {
  const id = convertirEntero(idTexto)
  return id === null ? undefined : categorias.find((categoria) => categoria.id === id)
}

export const handlers = [
  http.get(`${API}/categorias`, async () => {
    const falla = await simularRed()
    if (falla) return falla

    const respuesta = categorias.map((categoria) => ({
      ...categoria,
      cantidadLibros: libros.filter((libro) => libro.categoriaId === categoria.id).length,
    }))
    return HttpResponse.json(respuesta)
  }),

  // La lista no incluye la sinopsis: solo lo que se muestra en el listado
  http.get(`${API}/categorias/:id/libros`, async ({ params }) => {
    const falla = await simularRed()
    if (falla) return falla

    const categoria = buscarCategoria(params.id)
    if (!categoria) {
      return noEncontrado(`No existe una categoría con el id «${params.id}».`)
    }

    const librosCategoria = libros
      .filter((libro) => libro.categoriaId === categoria.id)
      .map(({ id, titulo, autor, anio, precio }) => ({ id, titulo, autor, anio, precio }))

    return HttpResponse.json({ categoria: { ...categoria }, libros: librosCategoria })
  }),

  http.get(`${API}/libros/:id`, async ({ params }) => {
    const falla = await simularRed()
    if (falla) return falla

    const id = convertirEntero(params.id)
    const libro = id === null ? undefined : libros.find((item) => item.id === id)
    if (!libro) {
      return noEncontrado(`No existe un libro con el id «${params.id}».`)
    }

    const { categoriaId, ...datosLibro } = libro
    const categoria = categorias.find((item) => item.id === categoriaId)

    return HttpResponse.json({
      ...datosLibro,
      categoria: { id: categoria.id, nombre: categoria.nombre },
    })
  }),
]
