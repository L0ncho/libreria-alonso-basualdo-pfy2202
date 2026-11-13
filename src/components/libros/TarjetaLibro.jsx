import { Link } from 'react-router'
import { clasesTarjetaEnlace } from '../../styles/clases.js'
import { formatearPrecio } from '../../utils/formato.js'

function TarjetaLibro({ libro }) {
  return (
    <Link to={`/libros/${libro.id}`} className={clasesTarjetaEnlace}>
      <h2 className="mb-0 text-xl">{libro.titulo}</h2>
      <p className="flex-1 text-texto-suave">
        {libro.autor} · {libro.anio}
      </p>
      <p className="text-lg font-bold text-primario">{formatearPrecio(libro.precio)}</p>
    </Link>
  )
}

export default TarjetaLibro
