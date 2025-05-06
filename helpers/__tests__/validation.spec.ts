import { checkEmail, checkEmptiness, checkFullName } from '_/helpers/validation'
import { describe, expect, it } from 'vitest'

describe('checkFullName', () => {
  it('should return true if not filled or not a string', () => {
    expect(checkFullName('')).toBe(true)

    expect(checkFullName(undefined)).toBe(true)
    expect(checkFullName(null)).toBe(true)
    expect(checkFullName(1)).toBe(true)
  })

  it('should return a string with an error if the param contains less than 4 characters but is not empty', () => {
    expect(typeof checkFullName('1') === 'string').toBeTruthy()
    expect(typeof checkFullName('aa') === 'string').toBeTruthy()
    expect(typeof checkFullName('123') === 'string').toBeTruthy()
  })

  it('should return a string with an error if the param is invalid or true otherwise', () => {
    expect(typeof checkFullName('s a') === 'string').toBeTruthy()
    expect(typeof checkFullName(' a   ') === 'string').toBeTruthy()
    expect(typeof checkFullName(' a   a') === 'string').toBeTruthy()
    expect(typeof checkFullName('Spiderman') === 'string').toBeTruthy()
    expect(typeof checkFullName('Charles') === 'string').toBeTruthy()

    expect(checkFullName('Charles K')).toBe(true)
    expect(checkFullName('Mr. Freeman')).toBe(true)
    expect(checkFullName('Mr. A')).toBe(true)
    expect(checkFullName('Santa Maria')).toBe(true)
    expect(checkFullName('Santa Claus')).toBe(true)

    expect(checkFullName('  Ss As   ')).toBe(true)
    expect(checkFullName('S Aa')).toBe(true)
    expect(checkFullName(' R Tr tr')).toBe(true)
  })
})

describe('checkEmail', () => {
  it('should return a string with an error if the param is not filled or not a string', () => {
    expect(typeof checkEmail('') === 'string').toBeTruthy()

    expect(typeof checkEmail(undefined) === 'string').toBeTruthy()
    expect(typeof checkEmail(null) === 'string').toBeTruthy()
    expect(typeof checkEmail(1) === 'string').toBeTruthy()
    expect(typeof checkEmail({}) === 'string').toBeTruthy()
  })

  it('should return a string with an error if the param is invalid or true otherwise', () => {
    expect(typeof checkEmail('a') === 'string').toBeTruthy()
    expect(typeof checkEmail('a@') === 'string').toBeTruthy()
    expect(typeof checkEmail('a@a.a') === 'string').toBeTruthy()
    expect(typeof checkEmail('test@test.t') === 'string').toBeTruthy()
    expect(typeof checkEmail('test@tes/t.tu') === 'string').toBeTruthy()
    expect(typeof checkEmail('test@test.t/u') === 'string').toBeTruthy()

    expect(checkEmail('a@a.aa')).toBe(true)
    expect(checkEmail('test@test.test')).toBe(true)
    expect(checkEmail('ru@ru.ru')).toBe(true)
    expect(checkEmail('test.ru@ru.ru')).toBe(true)
  })
})

describe('checkEmptiness', () => {
  it('should return true if the param is not empty, a string or a number, and false otherwise', () => {
    expect(checkEmptiness('a')).toBe(true)
    expect(checkEmptiness('0')).toBe(true)
    expect(checkEmptiness(0)).toBe(true)

    expect(checkEmptiness('')).toBe(false)
    expect(checkEmptiness(null)).toBe(false)
    expect(checkEmptiness(undefined)).toBe(false)
  })
})
