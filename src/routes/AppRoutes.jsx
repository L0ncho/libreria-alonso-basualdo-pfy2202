import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import Layout from '../components/Layout.jsx'

// Cada página se descarga recién cuando se visita su ruta
const Inicio = lazy(() => import('../pages/Inicio.jsx'))
const Categorias = lazy(() => import('../pages/Categorias.jsx'))
const LibrosCategoria = lazy(() => import('../pages/LibrosCategoria.jsx'))
const DetalleLibro = lazy(() => import('../pages/DetalleLibro.jsx'))
const NoEncontrado = lazy(() => import('../pages/NoEncontrado.jsx'))

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="categorias">
          <Route index element={<Categorias />} />
          <Route path=":id" element={<LibrosCategoria />} />
        </Route>
        <Route path="libros/:id" element={<DetalleLibro />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
