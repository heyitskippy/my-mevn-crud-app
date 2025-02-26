import type { Maybe } from '.'

export function isEmpty(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0
}

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object'
}

export function isNonNullable<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined
}

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

export type MakeNonNullable<T> = {
  [K in keyof T]: NonNullable<T[K]>
}
