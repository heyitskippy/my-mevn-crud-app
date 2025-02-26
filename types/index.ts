import type { Types } from 'mongoose'

export type Maybe<T> = T | null

export type ID = Types.ObjectId | string

export interface Entity {
  id: ID
}

export interface Dates {
  createdAt: Date | string
  updatedAt: Date | string
}
