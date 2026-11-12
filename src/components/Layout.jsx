import { Suspense } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import BotonTema from './BotonTema.jsx'
import Cargando from './Cargando.jsx'
import VolverArriba from './VolverArriba.jsx'
import { ESLOGAN, NOMBRE_TIENDA } from '../config/sitio.js'

const enlaces = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/categorias', texto: 'Categorías' },
]

const clasesEnlaceNavegacion =
  'block rounded-md px-3 py-1.5 text-sobre-primario no-underline hover:bg-primario-oscuro hover:underline focus-visible:outline-sobre-primario aria-[current=page]:bg-primario-oscuro'

function Layout() {
  const anioActual = new Date().getFullYear()

  return (
    <div className="flex min-h-screen flex-col">
      <VolverArriba />
      <header className="bg-primario px-4 py-4 text-sobre-primario">
        <div className="mx-auto flex max-w-240 flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/"
              className="font-serif text-2xl font-bold text-sobre-primario no-underline hover:underline focus-visible:outline-sobre-primario"
            >
              {NOMBRE_TIENDA}
            </Link>
            <p className="mt-0.5 text-sm">{ESLOGAN}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <nav aria-label="Navegación principal">
              <ul className="flex gap-1">
                {enlaces.map((enlace) => (
                  <li key={enlace.ruta}>
                    <NavLink
                      to={enlace.ruta}
                      end={enlace.ruta === '/'}
                      className={clasesEnlaceNavegacion}
                    >
                      {enlace.texto}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <BotonTema />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-240 flex-1 px-4 py-6">
        {/* Solo el contenido espera la carga de la página; encabezado y pie siguen visibles */}
        <Suspense fallback={<Cargando texto="Cargando página…" />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-borde bg-superficie px-4 py-4 text-center text-sm text-texto-suave">
        © {anioActual} {NOMBRE_TIENDA} · Proyecto académico con datos simulados
      </footer>
    </div>
  )
}

export default Layout
