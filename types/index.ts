import type Model from '@/models/Model'
import type { MakeMaybe } from './utilities'

export type Maybe<T> = T | null

export type ID = string

export type IModel = Model<NullableEntity, EntityForm>

export interface Entity {
  id: ID
}

export type EntityForm = Omit<NullableEntity, 'id' | 'createdAt'>
export type NullableEntity = MakeMaybe<Entity>

export interface Dates {
  createdAt: Date | string
  updatedAt: Date | string
}
