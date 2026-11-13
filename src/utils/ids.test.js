import { describe, expect, it } from 'vitest'
import { convertirEntero } from './ids.js'

describe('convertirEntero', () => {
  it.each([
    ['7', 7],
    ['007', 7],
    ['1', 1],
    [12, 12],
  ])('convierte %j en %j', (valor, esperado) => {
    expect(convertirEntero(valor)).toBe(esperado)
  })

  it.each(['0', '-1', '1.5', '1e3', ' 7', '7 ', 'abc', '7abc', '', null, undefined, 0, 1.5])(
    'devuelve null con %j',
    (valor) => {
      expect(convertirEntero(valor)).toBeNull()
    },
  )

  it('devuelve null fuera del rango de enteros seguros', () => {
    expect(convertirEntero('9007199254740993')).toBeNull()
  })
})
