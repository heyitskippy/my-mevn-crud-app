import type { Maybe } from '.'

export function isEmpty(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0
}

export function isObject(value: unknown) {
  return value !== null && typeof value === 'object'
}

export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
