import type { Types } from 'mongoose'
import type Model from '@/models/Model'
import type { MakeMaybe } from './utilities'

export type Maybe<T> = T | null

export type ID = Types.ObjectId | string

export type IModel = Model<NullableEntity>

export interface Entity {
  id: ID
}

export type NullableEntity = MakeMaybe<Entity>

export interface Dates {
  createdAt: Date | string
  updatedAt: Date | string
}
