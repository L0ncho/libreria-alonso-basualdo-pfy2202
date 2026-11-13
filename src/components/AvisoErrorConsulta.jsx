import { Link } from 'react-router'
import Aviso from './Aviso.jsx'
import Boton from './Boton.jsx'
import { TIPOS_ERROR, tituloError } from '../utils/errores.js'

// Error de una consulta con su alternativa para el usuario.
// - No encontrado: solo el enlace de salida; reintentar no lo arregla.
// - Servidor, red o desconocido: Reintentar y el enlace de salida.
// salida: { to, texto } del enlace a otra sección
function AvisoErrorConsulta({ error, reintentar, salida }) {
  const puedeReintentar = error.tipo !== TIPOS_ERROR.noEncontrado

  return (
    <Aviso
      tipo="error"
      titulo={tituloError(error.tipo)}
      acciones={
        <>
          {puedeReintentar && <Boton onClick={reintentar}>Reintentar</Boton>}
          <Link to={salida.to}>{salida.texto}</Link>
        </>
      }
    >
      {error.mensaje}
    </Aviso>
  )
}

export default AvisoErrorConsulta
