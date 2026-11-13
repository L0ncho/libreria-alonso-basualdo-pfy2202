import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

function renderizar() {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}

// Se renderiza después de iniciar la API simulada para que ninguna petición se adelante al
// worker. El mock se importa de forma dinámica: MSW queda en un archivo propio que no cambia
// entre publicaciones y el navegador lo reutiliza desde su caché. Si el archivo no se descarga
// o el worker no logra iniciar, la aplicación se muestra igual
import('./mocks/browser.js')
  .then(({ iniciarMock }) => iniciarMock())
  .catch((error) => {
    console.error('No se pudo iniciar la API simulada:', error)
  })
  .finally(renderizar)
