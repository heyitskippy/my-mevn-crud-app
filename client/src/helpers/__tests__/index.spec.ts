import { describe, it, expect } from 'vitest'

import { cloneDeep } from '@/helpers'

describe('cloneDeep', () => {
  it('Just returns value if primitive or undefined', () => {
    expect(cloneDeep(3) === 3).toBeTruthy()
    expect(cloneDeep(undefined) === undefined).toBeTruthy()
  })

  it('Successfully cloning empty array & empty object', () => {
    const arr: unknown[] = []
    const clonedArr = cloneDeep(arr)
    expect(clonedArr).toEqual(arr)
    expect(clonedArr === arr).toBeFalsy()

    const obj = {}
    const clonedObj = cloneDeep(obj)
    expect(clonedObj).toEqual(obj)
    expect(clonedObj === obj).toBeFalsy()
  })

  it('Successfully cloning matrix (nested arrays) with objects', () => {
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
