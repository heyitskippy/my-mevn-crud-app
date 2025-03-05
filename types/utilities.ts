import type { Maybe } from '.'

export type MakeMaybe<T, K extends keyof T = keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}

export type MakeNonNullable<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

export type Flatten<T> = T extends (infer R)[] ? R : T

export type PartialDeep<T> = T extends object
  ? {
      [P in keyof T]?: PartialDeep<T[P]>
    }
  : T
