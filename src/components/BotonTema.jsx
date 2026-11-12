import { useEffect, useState } from 'react'
import Boton from './Boton.jsx'

// Misma clave y valores que el script de index.html que aplica el tema antes de cargar React.
// La clave lleva el nombre de la tienda porque otros sitios publicados en el mismo dominio
// comparten el localStorage
const CLAVE_TEMA = 'librarte-tema'
const OSCURO = 'oscuro'
const CLARO = 'claro'

function temaInicial() {
  let guardado = null
  try {
    guardado = localStorage.getItem(CLAVE_TEMA)
  } catch {
    // Sin acceso a localStorage (modo privado o bloqueado): se usa la preferencia del sistema
  }
  if (guardado === OSCURO || guardado === CLARO) return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? OSCURO : CLARO
}

function guardarTema(tema) {
  try {
    localStorage.setItem(CLAVE_TEMA, tema)
  } catch {
    // Si no se puede guardar, el tema igual se aplica durante la visita
  }
}

function BotonTema() {
  const [tema, setTema] = useState(temaInicial)
  const oscuro = tema === OSCURO

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
  }, [tema])

  // Solo se guarda una elección explícita; sin elección se sigue la preferencia del sistema
  function alternar() {
    const nuevoTema = oscuro ? CLARO : OSCURO
    setTema(nuevoTema)
    guardarTema(nuevoTema)
  }

  return (
    <Boton variante="encabezado" tamano="compacto" aria-pressed={oscuro} onClick={alternar}>
      Modo oscuro
    </Boton>
  )
}

export default BotonTema
