// Apariencia de los botones: la usan Boton y los enlaces con aspecto de botón,
// para que ambos se vean siempre iguales. El hover usa not-disabled: (y no enabled:)
// porque un enlace nunca coincide con :enabled, pero tampoco está deshabilitado
const clasesBaseBoton =
  'inline-block cursor-pointer rounded-lg border text-center font-semibold no-underline disabled:cursor-not-allowed disabled:opacity-60'

const clasesVarianteBoton = {
  primario:
    'border-primario bg-primario text-sobre-primario not-disabled:hover:border-primario-oscuro not-disabled:hover:bg-primario-oscuro',
  secundario:
    'border-primario bg-superficie text-primario not-disabled:hover:bg-fondo not-disabled:hover:text-primario-oscuro',
  // Para usar sobre el fondo primario del encabezado
  encabezado:
    'border-sobre-primario bg-transparent text-sobre-primario not-disabled:hover:bg-primario-oscuro aria-pressed:bg-primario-oscuro focus-visible:outline-sobre-primario',
}

const clasesTamanoBoton = {
  normal: 'px-4.5 py-2.5',
  compacto: 'px-3 py-1',
}

export function clasesBoton(variante = 'primario', tamano = 'normal') {
  return [clasesBaseBoton, clasesVarianteBoton[variante], clasesTamanoBoton[tamano]].join(' ')
}

// Enlace (Link) con el aspecto del botón primario
export const clasesEnlaceBoton = clasesBoton('primario')

// Tarjeta enlazada de los listados (categorías y libros)
export const clasesTarjetaEnlace =
  'flex h-full flex-col gap-2 rounded-xl border border-borde bg-superficie p-5 font-normal text-texto no-underline hover:border-primario'
