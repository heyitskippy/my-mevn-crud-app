import { isEmpty } from '../utilities'

import { it, expect } from 'vitest'

it('isEmpty should return true if an object is empty and false otherwise', () => {
  expect(isEmpty({})).toBe(true)
  expect(isEmpty({ a: 1 })).toBe(false)
})
