import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages responde con 404.html al recargar una ruta interna:
// se copia index.html para que la SPA cargue y React Router resuelva la ruta
function copiarIndexComo404() {
  let carpetaSalida

  return {
    name: 'copiar-index-como-404',
    apply: 'build',
    configResolved(config) {
      carpetaSalida = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(carpetaSalida, 'index.html'), resolve(carpetaSalida, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // El sitio publicado vive en la subcarpeta del repositorio; en desarrollo se usa la raíz.
  // vite preview también corre con command "serve": sin isPreview serviría dist en la raíz,
  // aunque la compilación apunta a la subcarpeta, y no reproduciría GitHub Pages
  base: command === 'build' || isPreview ? '/libreria-alonso-basualdo-pfy2202/' : '/',
  plugins: [react(), tailwindcss(), copiarIndexComo404()],
}))
