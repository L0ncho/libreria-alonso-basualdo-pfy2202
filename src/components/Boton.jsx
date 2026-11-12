import { clasesBoton } from '../styles/clases.js'

// className solo agrega ajustes de layout (ancho, márgenes) al final de las clases propias
function Boton({
  variante = 'primario',
  tamano = 'normal',
  type = 'button',
  className = '',
  ...props
}) {
  const clases = [clasesBoton(variante, tamano), className].filter(Boolean).join(' ')

  return <button {...props} type={type} className={clases} />
}

export default Boton
