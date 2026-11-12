import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

// Al navegar a otra página se vuelve al inicio de la ventana; con atrás/adelante (POP)
// se respeta la posición que restaura el navegador
function VolverArriba() {
  const { pathname } = useLocation()
  const tipoNavegacion = useNavigationType()

  useEffect(() => {
    if (tipoNavegacion !== 'POP') {
      window.scrollTo(0, 0)
    }
  }, [pathname, tipoNavegacion])

  return null
}

export default VolverArriba
