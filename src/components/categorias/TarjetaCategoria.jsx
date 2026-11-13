import { Link } from 'react-router'
import { clasesTarjetaEnlace } from '../../styles/clases.js'
import { formatearCantidadLibros } from '../../utils/formato.js'

function TarjetaCategoria({ categoria }) {
  return (
    <Link to={`/categorias/${categoria.id}`} className={clasesTarjetaEnlace}>
      <h2 className="mb-0 text-xl">{categoria.nombre}</h2>
      <p className="flex-1 text-texto-suave">{categoria.descripcion}</p>
      <p className="text-sm font-semibold text-primario">
        {formatearCantidadLibros(categoria.cantidadLibros)}
      </p>
    </Link>
  )
}

export default TarjetaCategoria
