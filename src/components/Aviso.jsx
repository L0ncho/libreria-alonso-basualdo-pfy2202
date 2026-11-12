const clasesBase = 'mb-4 rounded-xl border border-l-4 border-borde bg-superficie px-5 py-4'

const clasesPorTipo = {
  info: 'border-l-primario text-texto',
  error: 'border-l-peligro text-peligro',
}

function Aviso({ tipo = 'info', children }) {
  const clasesTipo = clasesPorTipo[tipo] ?? clasesPorTipo.info

  return (
    <p className={`${clasesBase} ${clasesTipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}

export default Aviso
