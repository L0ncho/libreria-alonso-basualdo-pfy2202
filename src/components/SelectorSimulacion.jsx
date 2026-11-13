import { useId, useState } from 'react'
import {
  guardarModoSimulacion,
  leerModoSimulacion,
  OPCIONES_SIMULACION,
} from '../mocks/simulacion.js'

// Cambia el modo de la API simulada. No recarga la página: los handlers leen el modo
// en cada petición, así que el cambio aplica desde la siguiente
function SelectorSimulacion() {
  const idSelector = useId()
  const [modo, setModo] = useState(leerModoSimulacion)

  function cambiarModo(evento) {
    const nuevoModo = evento.target.value
    setModo(nuevoModo)
    guardarModoSimulacion(nuevoModo)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <label htmlFor={idSelector} className="font-semibold">
        Simulación de la API
      </label>
      <select
        id={idSelector}
        value={modo}
        onChange={cambiarModo}
        className="rounded-md border border-borde bg-superficie px-2 py-1 text-texto"
      >
        {OPCIONES_SIMULACION.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectorSimulacion
