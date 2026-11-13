import { describe, expect, it } from 'vitest'
import { errorIdInvalido, normalizarError, TIPOS_ERROR, tituloError } from './errores.js'

describe('normalizarError', () => {
  it('una falla de red queda como "red" con su mensaje', () => {
    const error = normalizarError({ red: true })
    expect(error).toEqual({
      tipo: TIPOS_ERROR.red,
      estado: null,
      mensaje: expect.stringContaining('conexión'),
    })
  })

  it('un 404 queda como "no-encontrado" y usa el mensaje del servidor', () => {
    const error = normalizarError({ estado: 404, mensaje: 'No existe una categoría con el id «99».' })
    expect(error).toEqual({
      tipo: TIPOS_ERROR.noEncontrado,
      estado: 404,
      mensaje: 'No existe una categoría con el id «99».',
    })
  })

  it('un 404 sin mensaje del servidor usa el mensaje por defecto', () => {
    const error = normalizarError({ estado: 404, mensaje: '   ' })
    expect(error.tipo).toBe(TIPOS_ERROR.noEncontrado)
    expect(error.mensaje).toBe('No encontramos lo que buscas.')
  })

  it.each([500, 503])('un %i queda como "servidor"', (estado) => {
    const error = normalizarError({ estado })
    expect(error.tipo).toBe(TIPOS_ERROR.servidor)
    expect(error.estado).toBe(estado)
    expect(error.mensaje).toMatch(/servidor/)
  })

  it('un 500 usa el mensaje del servidor si viene', () => {
    const error = normalizarError({ estado: 500, mensaje: 'Base de datos en mantención.' })
    expect(error.mensaje).toBe('Base de datos en mantención.')
  })

  it('otro código HTTP queda como "desconocido" e incluye el código', () => {
    const error = normalizarError({ estado: 418 })
    expect(error.tipo).toBe(TIPOS_ERROR.desconocido)
    expect(error.estado).toBe(418)
    expect(error.mensaje).toContain('418')
  })

  it('un AbortError queda como "cancelado"', () => {
    const error = normalizarError(new DOMException('Abortado', 'AbortError'))
    expect(error.tipo).toBe(TIPOS_ERROR.cancelado)
  })

  it('un JSON inválido (SyntaxError) queda como "desconocido" con su mensaje', () => {
    const error = normalizarError(new SyntaxError('Unexpected token'))
    expect(error.tipo).toBe(TIPOS_ERROR.desconocido)
    expect(error.mensaje).toMatch(/formato válido/)
  })

  it('un TypeError del propio código queda como "desconocido", no como falla de red', () => {
    const error = normalizarError(new TypeError("Cannot read properties of undefined (reading 'id')"))
    expect(error.tipo).toBe(TIPOS_ERROR.desconocido)
    expect(error.mensaje).not.toMatch(/conexión/)
  })

  it('un error ya normalizado se devuelve igual', () => {
    const normalizado = { tipo: TIPOS_ERROR.servidor, estado: 500, mensaje: 'Falla' }
    expect(normalizarError(normalizado)).toBe(normalizado)
  })

  it.each([undefined, null, 'texto', 42])('%j queda como "desconocido"', (valor) => {
    expect(normalizarError(valor).tipo).toBe(TIPOS_ERROR.desconocido)
  })
})

describe('errorIdInvalido', () => {
  it('se informa como "no-encontrado" sin código HTTP', () => {
    expect(errorIdInvalido('No existe un libro con el id «abc».')).toEqual({
      tipo: TIPOS_ERROR.noEncontrado,
      estado: null,
      mensaje: 'No existe un libro con el id «abc».',
    })
  })
})

describe('tituloError', () => {
  it.each([
    [TIPOS_ERROR.red, 'Sin conexión'],
    [TIPOS_ERROR.noEncontrado, 'No encontrado'],
    [TIPOS_ERROR.servidor, 'Error del servidor'],
    [TIPOS_ERROR.desconocido, 'Error inesperado'],
    ['otro', 'Error inesperado'],
  ])('para %j devuelve %j', (tipo, esperado) => {
    expect(tituloError(tipo)).toBe(esperado)
  })
})
