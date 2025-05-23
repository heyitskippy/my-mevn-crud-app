/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { NullableUserEntity } from '_/types/users'

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { computed, reactive, ref, shallowReactive, shallowRef } from 'vue'

import {
  cloneDeep,
  deleteByModelKeys,
  isEmpty,
  isNonNullable,
  fixTimezoneOffset,
  isModelLike,
  isNumber,
  isObject,
  isMaybeDate,
  mergeDeep,
  toOriginal,
  prettifyErrors,
  sleep,
  prepareDateTime,
  getTableItem,
  prepareCollection,
  assertAllRequired,
  getType,
} from '../'

import { USER_HEADERS } from '@/constants'

import User from '@/models/User'

describe('mergeDeep: recursively merge objects with any field type', () => {
  it("should just return the first argument, if it's the only argument", () => {
    const target = {
      a: {
        x: 0,
        b: {
          y: 1,
          z: 2,
        },
      },
    }

    expect(mergeDeep(target) == target).toBeTruthy()
  })

  it("should return the first argument, if it's primitive", () => {
    expect(mergeDeep(null, [1, 2])).toBe(null)
    expect(mergeDeep(1, [1, 2])).toBe(1)
    expect(mergeDeep('string', [1, 2])).toBe('string')
  })

  it('should deep merge objects and replace fields with the same keys if: the types do not match, in the target - non-primitive, in the sources - primitive; or primitive on both sides', () => {
    const target = {
      a: {
        x: 0,
        u: {
          b: [null, { a: 1 }],
        },
      },
      j: null,
      k: 'string',
      b: [1, 2],
      maybeObj: { o: 1 },
      maybeArr: [1],
      z: { z: 3 },
    }
    const object1 = {
      a: {
        x: 1,
        u: {
          y: 5,
          k: 9,
          b: [{ u: 3 }, { c: 2 }, null, { m: 3 }],
        },
      },
      j: 1,
      k: {
        gf: {
          a: [{ a: 1 }],
        },
      },
      b: [4, 5],
      maybeObj: [1],
      maybeArr: { o: 1 },
      z: null,
    }
    const object2 = {
      a: {
        u: {
          b: [null, { b: { k: 100 } }],
        },
      },
    }

    const merged = mergeDeep(target, object1, object2)

    expect(merged).toEqual({
      a: {
        x: 1,
        u: {
          y: 5,
          k: 9,
          b: [null, { a: 1, c: 2, b: { k: 100 } }, null, { m: 3 }],
        },
      },
      j: 1,
      k: 'string',
      b: [4, 5],
      maybeObj: { o: 1 },
      maybeArr: [1],
      z: null,
    })
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

    expect(cloneDeep(matrix).length).toBe(matrix.length)
    expect(cloneDeep(matrix[0]).length).toBe(matrix[0].length)

    expect(cloneDeep(matrix)).toStrictEqual(matrix)
    expect(cloneDeep(matrix)[1][1].id).toStrictEqual(matrix[1][1].id)

    expect(cloneDeep(matrix) == matrix).toBeFalsy()
    expect(cloneDeep(matrix)[1] == matrix[1]).toBeFalsy()
    expect(cloneDeep(matrix)[1][1] == matrix[1][1]).toBeFalsy()
  })
})

describe('getTableItem', () => {
  it('should return an unwrapped entity or undefined otherwise', (ctx) => {
    const headers = USER_HEADERS
    const key = headers[0].field

    const item1 = new User(ctx.fixtures.generateUser<Partial<NullableUserEntity>>())
    const item2 = [null, item1] as [null, User]

    expect(getTableItem(item1, key) === item1).toBeTruthy()
    expect(getTableItem(item2, key) === item1).toBeTruthy()

    expect(getTableItem(item1, 'dsfsd') === undefined).toBeTruthy()
  })
})

describe('prepareCollection', () => {
  it('should return a collection (Map) of Users with the same fields in the snapshots as in the params', (ctx) => {
    const users = Array.from({ length: 3 }).map((_, index) =>
      ctx.fixtures.generateUser({ id: String(index) }),
    )
    const map = prepareCollection<NullableUserEntity, User>(users, new Map(), User)

    expect(map.get(users[0].id)).toBeInstanceOf(User)

    const values = Array.from(map.values())

    expect(values.map((user) => user.getSnapshot())).toEqual(
      users.map((user) => expect.objectContaining(user)),
    )
  })

  it('should return the same collection with the same order as in the initial array; the passed collection had one untouched user from the initial array', (ctx) => {
    const users = Array.from({ length: 3 }).map((_, index) =>
      ctx.fixtures.generateUser({ id: String(index) }),
    )
    const secondUserId = users[1].id
    const onlyOne = [users[1]]

    const map = prepareCollection<NullableUserEntity, User>(onlyOne, new Map(), User)
    const secondUser = map.get(secondUserId)

    const theSameMap = prepareCollection<NullableUserEntity, User>(users, map, User)
    expect(map === theSameMap).toBeTruthy()

    const entries = Array.from(theSameMap)
    const secondEntry = entries[1][1]

    expect(secondUser === secondEntry).toBeTruthy()
  })

  it('should return the same collection with the same order as in the initial array; the passed collection had one EDITED user from the initial array', (ctx) => {
    const users = Array.from({ length: 5 }).map((_, index) =>
      ctx.fixtures.generateUser({ id: String(index) }),
    )
    const fourthUserId = users[3].id

    const map = prepareCollection<NullableUserEntity, User>([users[1], users[3]], new Map(), User)
    const fourthUser = map.get(fourthUserId)

    if (fourthUser) fourthUser.update({ fullName: 'Drizzt Do Urden' })

    prepareCollection<NullableUserEntity, User>(users, map, User)

    const entries = Array.from(map)
    const fourthEntry = entries[3][1]

    expect(fourthUser === fourthEntry).toBeTruthy()
  })

  it('should return the same collection with the same order as in the initial array; the passed collection had one DELETED user from the initial array', (ctx) => {
    const users = Array.from({ length: 5 }).map((_, index) =>
      ctx.fixtures.generateUser({ id: String(index) }),
    )
    const thirdUserId = users[2].id

    const map = prepareCollection<NullableUserEntity, User>([users[1], users[2]], new Map(), User)
    const thirdUser = map.get(thirdUserId)

    thirdUser?.delete()

    prepareCollection<NullableUserEntity, User>(users, map, User)

    const entries = Array.from(map)
    const thirdEntry = entries[2][1]

    expect(thirdUser === thirdEntry).toBeTruthy()
  })

  it('should return a collection with the same order as in the passed array; initially this collection had some edited/deleted users from this array; should keep these users untouched', (ctx) => {
    const users = Array.from({ length: 5 }).map((_, index) =>
      ctx.fixtures.generateUser({ id: String(index) }),
    )
    const secondUserId = users[1].id
    const fourthUserId = users[3].id

    const map = prepareCollection<NullableUserEntity, User>([users[1], users[3]], new Map(), User)
    const secondUser = map.get(secondUserId)
    const fourthUser = map.get(fourthUserId)

    if (secondUser) secondUser.update({ fullName: 'Drizzt Do Urden' })
    fourthUser?.delete()

    prepareCollection<NullableUserEntity, User>(users, map, User)

    const entries = Array.from(map)
    const secondEntry = entries[1][1]
    const fourthEntry = entries[3][1]

    expect(secondEntry === secondUser).toBeTruthy()
    expect(fourthEntry === fourthUser).toBeTruthy()
  })
})

describe('prepareDateTime', () => {
  it('should return a string with the local date according to the passed options and an empty string if the value is invalid', () => {
    const dateString = '2025-02-26T17:31:20.451+03:00'
    const date = new Date(dateString)

    expect(prepareDateTime(dateString, { timeZone: '+03:00' })).toBe('26.02.2025, 17:31')

    expect(prepareDateTime(date, { timeZone: '+03:00' })).toBe('26.02.2025, 17:31')
    expect(
      prepareDateTime(date, { timeZone: 'Europe/Moscow', dateStyle: 'full', timeStyle: 'full' }),
    ).toBe('среда, 26 февраля 2025 г. в 17:31:20 Москва, стандартное время')
    expect(
      prepareDateTime(date, {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: '+03:00',
      }),
    ).toBe('26 февр. 2025 г., 17:31:20')

    expect(prepareDateTime(1, { timeZone: '+03:00' })).toBe('01.01.1970, 03:00')
    expect(prepareDateTime('1', { timeZone: '+03:00' })).toBe('01.01.2001, 00:00')

    expect(prepareDateTime('2025-02-26T132')).toBe('')
    expect(prepareDateTime('123aa')).toBe('')
    expect(prepareDateTime('aa')).toBe('')
    expect(prepareDateTime('')).toBe('')
    expect(prepareDateTime(null)).toBe('')
    expect(prepareDateTime()).toBe('')
  })
})

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

  it('should return new Date for invalid input', () => {
    const result = fixTimezoneOffset(undefined as any)
    expect(result).toBeInstanceOf(Date)
  })
})

it('isMaybeDate should return true if the value can be used as a Date constructor parameter (string/number/Date) and false otherwise', () => {
  const value1 = Math.round(Math.random() * 10 ** 9)
  const value2 = new Date(value1)
  const value3 = '2'

  expect(isMaybeDate(value1)).toBe(true)
  expect(isMaybeDate(value2)).toBe(true)
  expect(isMaybeDate(value3)).toBe(true)

  expect(isMaybeDate(null)).toBe(false)
  expect(isMaybeDate(undefined)).toBe(false)
  expect(isMaybeDate({})).toBe(false)
})

describe('isNumber', () => {
  const value1 = Math.random()
  const value2 = value1 * 100

  it('should return true if the value is a number and false otherwise', () => {
    expect(isNumber(value1)).toBe(true)
    expect(isNumber(value2)).toBe(true)

    expect(isNumber(-value1)).toBe(true)
    expect(isNumber(+0)).toBe(true)
    expect(isNumber(-0)).toBe(true)

    expect(isNumber('')).toBe(false)
    expect(isNumber('0')).toBe(false)
    expect(isNumber('asd')).toBe(false)

    expect(isNumber(undefined)).toBe(false)
    expect(isNumber(null)).toBe(false)
  })

  it('should return false if the value is a bigInt', () => {
    const bigIntValue = BigInt(Math.round(value2) + 2 ** 53)

    expect(isNumber(9007199254740991n)).toBe(false)
    expect(isNumber(bigIntValue)).toBe(false)
  })

  it('should return false if the value is NaN, Infinity or -Infinity', () => {
    expect(isNumber(NaN)).toBe(false)
    expect(isNumber(Infinity)).toBe(false)
    expect(isNumber(-Infinity)).toBe(false)
  })
})

describe('isEmpty', () => {
  it('should return true if the object is empty and false otherwise', () => {
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)

    expect(isEmpty(1)).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty([1, 2])).toBe(false)
  })
})

it('isObject should return true if the value is not primitive or function and false otherwise', () => {
  expect(isObject(1)).toBe(false)
  expect(isObject('1')).toBe(false)
  expect(isObject(null)).toBe(false)
  expect(isObject(undefined)).toBe(false)
  expect(isObject(() => {})).toBe(false)

  expect(isObject(new Map())).toBe(true)
  expect(isObject([])).toBe(true)
  expect(isObject({})).toBe(true)
  expect(isObject({ a: 1 })).toBe(true)
})

it('isNonNullable should return true if the value is not null or undefined, and false otherwise', () => {
  expect(isNonNullable(null)).toBe(false)
  expect(isNonNullable(undefined)).toBe(false)
  expect(isNonNullable(0)).toBe(true)
  expect(isNonNullable('')).toBe(true)
  expect(isNonNullable('a')).toBe(true)
})

it('isModelLike should return true if the value is an instance of the Model-like class', () => {
  expect(isModelLike(null)).toBe(false)
  expect(isModelLike(undefined)).toBe(false)
  expect(isModelLike(0)).toBe(false)
  expect(isModelLike('a')).toBe(false)
  expect(isModelLike({})).toBe(false)

  expect(isModelLike(new User())).toBe(true)
})

describe('toOriginal', () => {
  it('should return primitive or object arguments', () => {
    expect(toOriginal(undefined)).toBe(undefined)
    expect(toOriginal(null)).toBe(null)
    expect(toOriginal(1)).toBe(1)
    expect(toOriginal('a')).toBe('a')

    const obj = {}
    expect(toOriginal(obj) === obj).toBeTruthy()
  })

  it('should return the raw value instead of its ref (depth-aware) or getter', () => {
    const ref1 = ref(1)

    const obj1 = {}
    const ref2 = ref(obj1)

    const obj2 = { a: { b: {} } }
    const ref3 = ref(obj2)
    const getter = computed(() => obj2)

    expect(toOriginal(ref1) === 1).toBeTruthy()
    expect(toOriginal(ref2) === obj1).toBeTruthy()

    expect(toOriginal(ref3) === obj2).toBeTruthy()
    expect(toOriginal(ref3).a.b === obj2.a.b).toBeTruthy()

    expect(toOriginal(getter) === obj2).toBeTruthy()
  })

  it('should return the raw value instead of its shallowRef or shallowReactive', () => {
    const obj = { a: {} }
    const shallowRef1 = shallowRef(obj)
    const shallowReactive1 = shallowReactive(obj)

    expect(toOriginal(shallowRef1) === obj).toBeTruthy()
    expect(toOriginal(shallowReactive1) === obj).toBeTruthy()
  })

  it('should return the raw value instead of reactive object (depth-aware)', () => {
    const obj = { a: { b: {} } }
    const reactive1 = reactive(obj)

    expect(toOriginal(reactive1) === obj).toBeTruthy()
    expect(toOriginal(reactive1).a.b === obj.a.b).toBeTruthy()
  })

  it('toOriginal should handle circular references gracefully', () => {
    const obj: any = {}

    obj.self = obj

    expect(toOriginal(obj)).toBe(obj)
  })
})

describe('prettifyErrors', () => {
  it('should return a formatted string with a list of errors', () => {
    const errors = {
      email: 'This email already exists!',
      server:
        'E11000 duplicate key error collection: my_db.users index: email_1 dup key: { email: "1111@gmail.com" }',
    }

    expect(prettifyErrors({})).toBe(' ')
    expect(prettifyErrors(errors)).toBe(
      ' email: This email already exists!\n server: E11000 duplicate key error collection: my_db.users index: email_1 dup key:   email: \\1111@gmail.com\\ ',
    )
  })

  it('should handle empty input gracefully', () => {
    expect(prettifyErrors(undefined as any)).toBe('')
    expect(prettifyErrors(null as any)).toBe('')
  })
})

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not resolve until timeout has elapsed', async () => {
    const spy = vi.fn()
    sleep(100).then(spy)

    vi.advanceTimersByTime(20)
    await Promise.resolve()
    expect(spy).not.toHaveBeenCalled()

    vi.advanceTimersByTime(80)
    await Promise.resolve()
    expect(spy).toHaveBeenCalled()
  })

  it('sleep resolves immediately for 0 ms', async () => {
    const promise = sleep(0)
    vi.advanceTimersByTime(0)

    const result = await promise
    expect(result).toBe(true)
  })
})

describe('assertAllRequired', () => {
  it('should not throw if all properties are present', () => {
    expect(() => assertAllRequired({ a: 1, b: 2 })).not.toThrow()
  })

  it('should throw if a property is missing', () => {
    expect(() => assertAllRequired({ a: 1, b: undefined })).toThrow(
      /Missing required property: "b"/,
    )
  })
})

describe('getType', () => {
  it('should return the correct type from formFields', () => {
    const fields = { foo: { type: 'number' }, bar: { type: 'email' } }

    expect(getType('foo', fields as any)).toBe('number')
    expect(getType('bar', fields as any)).toBe('email')
  })

  it('should return "text" if type is not defined', () => {
    const fields = { foo: {} }

    expect(getType('foo', fields as any)).toBe('text')
    expect(getType('baz', fields as any)).toBe('text')
  })
})
