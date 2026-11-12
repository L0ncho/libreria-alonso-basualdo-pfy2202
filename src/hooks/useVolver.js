import { useLocation, useNavigate } from 'react-router'

// Vuelve a la página anterior solo si existe dentro del sitio. Si se entró directo
// (enlace externo, recarga o pestaña nueva) la ubicación tiene key "default" y se va
// a la ruta de respaldo para no salir del sitio
export function useVolver(rutaDeRespaldo) {
  const navigate = useNavigate()
  const location = useLocation()

  return function volver() {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(rutaDeRespaldo)
    }
  }
}
