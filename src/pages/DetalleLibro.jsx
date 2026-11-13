import { Link, useParams } from 'react-router'
import AvisoErrorConsulta from '../components/AvisoErrorConsulta.jsx'
import Boton from '../components/Boton.jsx'
import Cargando from '../components/Cargando.jsx'
import TituloPagina from '../components/TituloPagina.jsx'
import { useLibro } from '../hooks/useLibro.js'
import { useVolver } from '../hooks/useVolver.js'
import { errorIdInvalido, TIPOS_ERROR } from '../utils/errores.js'
import { formatearPrecio } from '../utils/formato.js'

const TITULO_GENERICO = 'Detalle del libro'
const SALIDA = { to: '/categorias', texto: 'Ver todas las categorías' }

function DetalleLibro() {
  const { id } = useParams()
  const { datos: libro, cargando, error, reintentar, idInvalido } = useLibro(id)

  // Estado derivado: nada de esto se guarda
  const errorMostrado = idInvalido ? errorIdInvalido(`No existe un libro con el id «${id}».`) : error
  const noEncontrado = errorMostrado?.tipo === TIPOS_ERROR.noEncontrado
  const titulo = libro?.titulo ?? (noEncontrado ? 'Libro no encontrado' : TITULO_GENERICO)
  const rutaCategoria = libro ? `/categorias/${libro.categoria.id}` : '/categorias'

  const volver = useVolver(rutaCategoria)

  return (
    <div>
      <TituloPagina texto={titulo} />
      <Boton variante="secundario" tamano="compacto" className="mb-4" onClick={volver}>
        Volver
      </Boton>
      <h1>{titulo}</h1>

      <section aria-label="Información del libro" aria-busy={cargando}>
        {cargando && <Cargando texto="Cargando libro…" />}

        {errorMostrado && (
          <AvisoErrorConsulta error={errorMostrado} reintentar={reintentar} salida={SALIDA} />
        )}

        {libro && (
          <article className="rounded-2xl border border-borde bg-superficie p-5 md:p-8">
            <p className="mb-4 text-lg text-texto">
              de <span className="font-semibold">{libro.autor}</span>
            </p>

            <dl className="mb-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-texto-suave">Año</dt>
                <dd className="font-semibold text-texto">{libro.anio}</dd>
              </div>
              <div>
                <dt className="text-sm text-texto-suave">Precio</dt>
                <dd className="text-lg font-bold text-primario">{formatearPrecio(libro.precio)}</dd>
              </div>
              <div>
                <dt className="text-sm text-texto-suave">Categoría</dt>
                <dd>
                  <Link to={rutaCategoria}>{libro.categoria.nombre}</Link>
                </dd>
              </div>
            </dl>

            <h2>Sinopsis</h2>
            <p className="max-w-[65ch] text-texto">{libro.sinopsis}</p>
          </article>
        )}
      </section>
    </div>
  )
}

export default DetalleLibro
