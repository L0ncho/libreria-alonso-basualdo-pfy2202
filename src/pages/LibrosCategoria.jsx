import { Link, useParams } from 'react-router'
import Aviso from '../components/Aviso.jsx'
import AvisoErrorConsulta from '../components/AvisoErrorConsulta.jsx'
import Boton from '../components/Boton.jsx'
import Cargando from '../components/Cargando.jsx'
import TituloPagina from '../components/TituloPagina.jsx'
import TarjetaLibro from '../components/libros/TarjetaLibro.jsx'
import { useLibrosCategoria } from '../hooks/useLibrosCategoria.js'
import { useVolver } from '../hooks/useVolver.js'
import { errorIdInvalido, TIPOS_ERROR } from '../utils/errores.js'

const TITULO_GENERICO = 'Libros de la categoría'
const SALIDA = { to: '/categorias', texto: 'Ver todas las categorías' }

function LibrosCategoria() {
  const { id } = useParams()
  const { datos, cargando, error, reintentar, idInvalido } = useLibrosCategoria(id)
  const volver = useVolver('/categorias')

  // Estado derivado: nada de esto se guarda
  const errorMostrado = idInvalido
    ? errorIdInvalido(`No existe una categoría con el id «${id}».`)
    : error
  const noEncontrada = errorMostrado?.tipo === TIPOS_ERROR.noEncontrado
  const categoria = datos?.categoria
  const libros = datos?.libros
  const titulo = categoria?.nombre ?? (noEncontrada ? 'Categoría no encontrada' : TITULO_GENERICO)

  return (
    <div>
      <TituloPagina texto={titulo} />
      <Boton variante="secundario" tamano="compacto" className="mb-4" onClick={volver}>
        Volver
      </Boton>
      <h1>{titulo}</h1>
      {categoria && <p className="mb-6 text-texto-suave">{categoria.descripcion}</p>}

      <section aria-label="Libros de la categoría" aria-busy={cargando}>
        {cargando && <Cargando texto="Cargando libros…" />}

        {errorMostrado && (
          <AvisoErrorConsulta error={errorMostrado} reintentar={reintentar} salida={SALIDA} />
        )}

        {!cargando && !errorMostrado && libros?.length === 0 && (
          <Aviso acciones={<Link to={SALIDA.to}>{SALIDA.texto}</Link>}>
            Esta categoría todavía no tiene libros. Revisa las demás categorías.
          </Aviso>
        )}

        {libros?.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {libros.map((libro) => (
              <li key={libro.id}>
                <TarjetaLibro libro={libro} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default LibrosCategoria
