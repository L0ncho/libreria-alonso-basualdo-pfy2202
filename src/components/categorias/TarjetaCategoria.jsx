import { Link } from 'react-router'
import { formatearCantidadLibros } from '../../utils/formato.js'

const clasesTarjeta =
  'flex h-full flex-col gap-2 rounded-xl border border-borde bg-superficie p-5 font-normal text-texto no-underline hover:border-primario'

function TarjetaCategoria({ categoria }) {
  return (
    <Link to={`/categorias/${categoria.id}`} className={clasesTarjeta}>
      <h2 className="mb-0 text-xl">{categoria.nombre}</h2>
      <p className="flex-1 text-texto-suave">{categoria.descripcion}</p>
      <p className="text-sm font-semibold text-primario">
        {formatearCantidadLibros(categoria.cantidadLibros)}
      </p>
    </Link>
  )
}

export default TarjetaCategoria
