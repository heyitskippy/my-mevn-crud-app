/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { IModel, Maybe, ID, NullableEntity } from '.'

export type MakeMaybe<T, K extends keyof T = keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

export type MakeRequiredNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export type MakeRequired<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]-?: T[SubKey]
}

export type MakePartial<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: T[SubKey]
}

export type Flatten<T> = T extends (infer R)[] ? R : T extends Map<Maybe<ID>, infer R> ? R : T

export type PartialDeep<T> = T extends object
  ? {
      [P in keyof T]?: PartialDeep<T[P]>
    }
  : T

export type TMap<M extends IModel | NullableEntity | object> = Map<Maybe<ID>, M>

export type Constructor<T, A extends unknown[] = any[]> = new (...args: A) => T

export type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never
}[keyof T]

export type AssertAllRequired<T> = OptionalKeys<T> extends never ? T : never
