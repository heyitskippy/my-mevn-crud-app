import { isEmpty, isNonNullable } from '../utilities'

import { it, expect } from 'vitest'

it('isEmpty should return true if an object is empty and false otherwise', () => {
  expect(isEmpty(1)).toBe(false)
  expect(isEmpty({})).toBe(true)
  expect(isEmpty({ a: 1 })).toBe(false)
})

it('isNonNullable should return true if a value is not null or undefined, and false otherwise', () => {
  expect(isNonNullable(null)).toBe(false)
  expect(isNonNullable(undefined)).toBe(false)
  expect(isNonNullable(0)).toBe(true)
  expect(isNonNullable('')).toBe(true)
})
