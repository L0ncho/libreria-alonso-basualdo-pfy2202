import { ESLOGAN, NOMBRE_TIENDA } from '../config/sitio.js'

// Sin texto (página de inicio) se muestra el nombre de la tienda con su eslogan
function TituloPagina({ texto }) {
  const titulo = texto ? `${texto} | ${NOMBRE_TIENDA}` : `${NOMBRE_TIENDA} | ${ESLOGAN}`

  return <title>{titulo}</title>
}

export default TituloPagina
