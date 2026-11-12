// Indicador de carga accesible: role="status" anuncia el texto a los lectores de pantalla.
// El aria-busy va en la región que se está actualizando, no aquí
function Cargando({ texto = 'Cargando…' }) {
  return (
    <div
      role="status"
      className="mb-4 flex items-center gap-3 rounded-xl border border-borde bg-superficie px-5 py-4 text-texto"
    >
      <span
        aria-hidden="true"
        className="size-5 shrink-0 animate-spin rounded-full border-3 border-borde border-t-primario motion-reduce:animate-none"
      />
      <span>{texto}</span>
    </div>
  )
}

export default Cargando
