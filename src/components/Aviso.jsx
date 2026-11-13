const clasesBase = 'mb-4 rounded-xl border border-l-4 border-borde bg-superficie px-5 py-4'

const clasesPorTipo = {
  info: 'border-l-primario text-texto',
  error: 'border-l-peligro text-peligro',
}

// acciones: botones o enlaces que ofrecen una alternativa (reintentar, ir a otra sección)
function Aviso({ tipo = 'info', titulo, acciones, children }) {
  const clasesTipo = clasesPorTipo[tipo] ?? clasesPorTipo.info

  return (
    <div className={`${clasesBase} ${clasesTipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {titulo && <p className="mb-1 font-bold">{titulo}</p>}
      <p>{children}</p>
      {acciones && <div className="mt-3 flex flex-wrap items-center gap-3">{acciones}</div>}
    </div>
  )
}

export default Aviso
