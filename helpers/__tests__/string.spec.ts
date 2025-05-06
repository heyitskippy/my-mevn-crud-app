import string from '_/helpers/string'

import { describe, it, expect } from 'vitest'

describe('string.isEmpty', () => {
  it('should return true if the string is empty, and false otherwise', () => {
    expect(string.isEmpty('')).toBe(true)

    expect(string.isEmpty('1')).toBe(false)
    expect(string.isEmpty('null')).toBe(false)
  })

  it('should throw an error if the param is not a string', () => {
    expect(() => string.isEmpty('')).not.toThrowError()

    expect(() => string.isEmpty(1)).toThrowError('Not a string!')
    expect(() => string.isEmpty(false)).toThrowError('Not a string!')
    expect(() => string.isEmpty({})).toThrowError('Not a string!')

    expect(() => string.isEmpty(null)).toThrowError('Not a string!')
    expect(() => string.isEmpty(undefined)).toThrowError('Not a string!')
  })
})

describe('string.isString', () => {
  it('should return true if the param is a string', () => {
    expect(string.isString('')).toBe(true)
    expect(string.isString('1')).toBe(true)
    expect(string.isString('{}')).toBe(true)
    expect(string.isString('null')).toBe(true)
  })
})
