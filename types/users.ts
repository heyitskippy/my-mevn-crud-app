import type { Entity, Dates } from '.'
import type { MakeMaybe } from './utilities'

export type UserForm = Omit<NullableUserEntity, 'id' | 'createdAt' | 'updatedAt'>

export type NullableUserEntity = MakeMaybe<UserEntity>

export interface UserEntity extends IUser, Entity, Dates {}

export interface IUser {
  fullName: string
  email: string
  role: Role
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}
