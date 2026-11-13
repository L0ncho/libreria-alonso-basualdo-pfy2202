import { describe, expect, it } from 'vitest'
import { formatearCantidadLibros, formatearPrecio } from './formato.js'

describe('formatearPrecio', () => {
  it.each([
    [18990, '$18.990'],
    [1200, '$1.200'],
    [990, '$990'],
    [0, '$0'],
  ])('formatea %j como %j en pesos chilenos', (precio, esperado) => {
    expect(formatearPrecio(precio)).toBe(esperado)
  })
})

describe('formatearCantidadLibros', () => {
  it.each([
    [0, 'Sin libros por ahora'],
    [1, '1 libro'],
    [3, '3 libros'],
  ])('con %j devuelve %j', (cantidad, esperado) => {
    expect(formatearCantidadLibros(cantidad)).toBe(esperado)
  })
})
