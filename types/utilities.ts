import type { Maybe } from '.'

export function isEmpty(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0
}

export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object'
}

export function assertNonNullish<T>(value: T, error?: Error): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    error ??= new Error('Something does not exist')

    throw error
  }
}

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
