import { setupServer } from 'msw/node'
import { handlers } from '../mocks/handlers.js'

// Servidor de pruebas con los mismos handlers que usa el sitio. Cada prueba puede
// reemplazar una respuesta con server.use (errores) y se restablecen con resetHandlers
export const server = setupServer(...handlers)

// Misma base que usan el cliente y los handlers: BASE_URL es "/" fuera de la compilación
export const API = `${import.meta.env.BASE_URL}api`
