import { describe, it, expect } from 'vitest'

import User from '@/models/User'

import {
  cloneDeep,
  deleteByModelKeys,
  isEmpty,
  isNonNullable,
  fixTimezoneOffset,
  isModelLike,
} from '../'

describe('fixTimezoneOffset', () => {
  const date = '2025-02-26T14:31:20.451Z'
  const fixed = fixTimezoneOffset(date)

  it('should return a Date object with the time equal to the current time plus the current timezone offset (so it should be "wrong")', () => {
    const offset = new Date().getTimezoneOffset() * 60 * 1000

    const timestamp = fixed.getTime()
    expect(new Date(timestamp + offset).toJSON()).toBe(new Date(date).toJSON())

    const delta = timestamp - new Date(date).getTime()
    expect(Math.abs(delta)).toBe(Math.abs(offset))
  })

  it('should return a "right" Date object, if it has "backwards" flag as true and a "wrong" Date as input', () => {
    expect(fixTimezoneOffset(fixed, true).toJSON()).toBe(new Date(date).toJSON())
  })
})

describe('cloneDeep', () => {
  it('should simply return the value if it is primitive or undefined', () => {
    expect(cloneDeep(3) === 3).toBeTruthy()
    expect(cloneDeep(undefined) === undefined).toBeTruthy()
  })

  it('should clone an empty array & an empty object', () => {
    const arr: unknown[] = []
    const clonedArr = cloneDeep(arr)
    expect(clonedArr).toEqual(arr)
    expect(clonedArr === arr).toBeFalsy()

    const obj = {}
    const clonedObj = cloneDeep(obj)
    expect(clonedObj).toEqual(obj)
    expect(clonedObj === obj).toBeFalsy()
  })

  it('should clone a matrix (nested arrays) with objects', () => {
    const matrix = [
      [{ id: 11 }, { id: 12 }, { id: 13 }],
      [{ id: 21 }, { id: 22 }, { id: 23 }],
      [{ id: 31 }, { id: 32 }, { id: 33 }],
    ]

    expect(cloneDeep(matrix).length).toEqual(matrix.length)
    expect(cloneDeep(matrix[0]).length).toEqual(matrix[0].length)

    expect(cloneDeep(matrix)).toStrictEqual(matrix)
    expect(cloneDeep(matrix)[1][1].id).toStrictEqual(matrix[1][1].id)

    expect(cloneDeep(matrix) == matrix).toBeFalsy()
    expect(cloneDeep(matrix)[1] == matrix[1]).toBeFalsy()
    expect(cloneDeep(matrix)[1][1] == matrix[1][1]).toBeFalsy()
  })
})

describe('deleteByModelKeys: deletes props of target whose keys are not contained in the model', () => {
  it('should delete props of flat target', () => {
    const target = {
      a: 1,
      b: 2,
      c: 3,
      4: [],
      d: null,
      e: 'null',
      z: 'k',
    }
    const model = {
      b: 222,
      m: 6,
      d: null,
      e: 'null',
      4: [],
    }

    deleteByModelKeys(target, model)

    expect(target).toEqual({
      b: 2,
      4: [],
      d: null,
      e: 'null',
    })
  })

  it('should deeply delete (without arrays, with an extra key in the model)', () => {
    const target = {
      a: {
        x: 0,
        b: {
          y: 1,
          z: 2,
        },
        u: {
          y: 5,
          z: 6,
        },
      },
      j: null,
      k: 'string',
    }
    const model = {
      a: {
        x: 0,
        u: {
          y: 5,
          k: 9,
        },
      },
      j: null,
    }

    deleteByModelKeys(target, model, true)

    expect(target).toEqual({
      a: {
        x: 0,
        u: {
          y: 5,
        },
      },
      j: null,
    })
  })

  it('should deeply delete; clear the contents of a prop with an object or array if the model prop is primitive, ignore any other arrays', () => {
    const target = {
      0: [1, 2, 3],
      a: {
        b: {
          c: [1, 2, 3],
        },
        c: {},
        m: {
          g: [3, 2, 1],
        },
      },

      j: null,
      k: [
        [1],
        {},
        {
          f: null,
        },
      ],
    }
    const model = {
      0: null,
      a: {
        b: {
          c: null,
        },
        c: null,
        m: 'string',
      },
      k: [
        {
          f: null,
        },
      ],
    }

    deleteByModelKeys(target, model, true)

    expect(target).toEqual({
      0: [],
      a: {
        b: {
          c: [],
        },
        c: {},
        m: {},
      },
      k: [
        [1],
        {},
        {
          f: null,
        },
      ],
    })
  })
})

it('isEmpty should return true if the object is empty and false otherwise', () => {
  expect(isEmpty(1)).toBe(false)
  expect(isEmpty({})).toBe(true)
  expect(isEmpty({ a: 1 })).toBe(false)
})

it('isNonNullable should return true if the value is not null or undefined, and false otherwise', () => {
  expect(isNonNullable(null)).toBe(false)
  expect(isNonNullable(undefined)).toBe(false)
  expect(isNonNullable(0)).toBe(true)
  expect(isNonNullable('')).toBe(true)
})

it('isModelLike should return true if the value is an instance of the Model-like class', () => {
  expect(isModelLike(null)).toBe(false)
  expect(isModelLike(undefined)).toBe(false)
  expect(isModelLike(0)).toBe(false)
  expect(isModelLike({})).toBe(false)

  expect(isModelLike(new User())).toBe(true)
})
