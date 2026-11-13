import { useConsulta } from './useConsulta.js'
import { RUTA_CATEGORIAS } from '../services/categorias.js'

export function useCategorias() {
  return useConsulta(RUTA_CATEGORIAS)
}
