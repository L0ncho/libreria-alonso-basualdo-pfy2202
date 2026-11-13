import { Link } from 'react-router'
import Aviso from '../components/Aviso.jsx'
import Boton from '../components/Boton.jsx'
import Cargando from '../components/Cargando.jsx'
import TituloPagina from '../components/TituloPagina.jsx'
import TarjetaCategoria from '../components/categorias/TarjetaCategoria.jsx'
import { useCategorias } from '../hooks/useCategorias.js'
import { tituloError } from '../utils/errores.js'

function Categorias() {
  const { datos: categorias, cargando, error, reintentar } = useCategorias()

  return (
    <div>
      <TituloPagina texto="Categorías" />
      <h1>Categorías</h1>
      <p className="mb-6 text-texto-suave">Elige una categoría para ver sus libros.</p>

      <section aria-label="Listado de categorías" aria-busy={cargando}>
        {cargando && <Cargando texto="Cargando categorías…" />}

        {error && (
          <Aviso
            tipo="error"
            titulo={tituloError(error.tipo)}
            acciones={
              <>
                <Boton onClick={reintentar}>Reintentar</Boton>
                <Link to="/">Ir al inicio</Link>
              </>
            }
          >
            {error.mensaje}
          </Aviso>
        )}

        {!cargando && !error && categorias?.length === 0 && (
          <Aviso acciones={<Link to="/">Ir al inicio</Link>}>
            Todavía no hay categorías disponibles.
          </Aviso>
        )}

        {categorias?.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categorias.map((categoria) => (
              <li key={categoria.id}>
                <TarjetaCategoria categoria={categoria} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Categorias
