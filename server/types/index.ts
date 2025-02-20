import type { Types } from 'mongoose'

export type Maybe<T> = T | null

export type ID = Types.ObjectId

export interface Entity {
  id: ID
}

export interface Dates {
  createdAt: Date
  updatedAt: Date
}
