import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

export const worker = setupWorker(...handlers)

// El mock queda activo también en producción (GitHub Pages). El worker y su alcance usan la base
// del sitio; las peticiones que no son de la API siguen a la red sin aviso
export function iniciarMock() {
  return worker.start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      options: { scope: import.meta.env.BASE_URL },
    },
    onUnhandledRequest: 'bypass',
    quiet: !import.meta.env.DEV,
  })
}
