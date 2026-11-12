import Boton from '../components/Boton.jsx'
import TituloPagina from '../components/TituloPagina.jsx'
import { useVolver } from '../hooks/useVolver.js'

function DetalleLibro() {
  const volver = useVolver('/categorias')

  return (
    <section>
      <TituloPagina texto="Detalle del libro" />
      <Boton variante="secundario" tamano="compacto" className="mb-4" onClick={volver}>
        Volver
      </Boton>
      <h1>Detalle del libro</h1>
    </section>
  )
}

export default DetalleLibro
