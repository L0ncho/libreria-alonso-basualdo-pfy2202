import { Link } from 'react-router'
import TituloPagina from '../components/TituloPagina.jsx'
import { ESLOGAN, NOMBRE_TIENDA } from '../config/sitio.js'
import { clasesEnlaceBoton } from '../styles/clases.js'

function Inicio() {
  return (
    <section className="rounded-2xl border border-borde bg-superficie px-6 py-8 md:px-10 md:py-12">
      <TituloPagina />
      <h1>Te damos la bienvenida a {NOMBRE_TIENDA}</h1>
      <p className="mb-2 font-serif text-lg text-texto italic">{ESLOGAN}</p>
      <p className="mb-6 max-w-[60ch] text-texto-suave">
        Recorre nuestras categorías, descubre los libros de cada una y revisa el detalle
        del que más te llame la atención.
      </p>
      <Link to="/categorias" className={clasesEnlaceBoton}>
        Ver categorías
      </Link>
    </section>
  )
}

export default Inicio
