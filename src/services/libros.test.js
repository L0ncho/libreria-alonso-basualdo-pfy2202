import { describe, expect, it } from 'vitest'
import { rutaLibro, rutaLibrosCategoria } from './libros.js'

const INVALIDOS = ['0', '-1', '1.5', '1e3', ' 7', 'abc', '', null, undefined]

describe('rutaLibrosCategoria', () => {
  it('arma la ruta de los libros de la categoría', () => {
    expect(rutaLibrosCategoria('3')).toBe('/categorias/3/libros')
  })

  it('genera la misma ruta para ids equivalentes', () => {
    expect(rutaLibrosCategoria('007')).toBe(rutaLibrosCategoria('7'))
  })

  it.each(INVALIDOS)('devuelve null con el id inválido %j', (id) => {
    expect(rutaLibrosCategoria(id)).toBeNull()
  })
})

describe('rutaLibro', () => {
  it('arma la ruta del libro', () => {
    expect(rutaLibro('12')).toBe('/libros/12')
  })

  it('genera la misma ruta para ids equivalentes', () => {
    expect(rutaLibro('007')).toBe(rutaLibro('7'))
  })

  it.each(INVALIDOS)('devuelve null con el id inválido %j', (id) => {
    expect(rutaLibro(id)).toBeNull()
  })
})
