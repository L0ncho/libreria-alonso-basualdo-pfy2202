import { vi } from 'vitest'

// En Node no existe location. El interceptor de fetch de msw/node y los handlers del mock la usan
// para resolver rutas relativas como "/api/categorias", igual que el navegador las resuelve
// contra la página. Con esto el cliente HTTP se prueba sin cambios y con los handlers reales
vi.stubGlobal('location', new URL('http://localhost/'))
