import type { Entity, Dates, Maybe } from '.'
import type { MakeMaybe } from './utilities'

export interface UserDocument extends UserEntity, IUserMethods {}
export interface IUserMethods {
  comparePassword(plainPassword: string): Promise<boolean>
}

export type UserForm = Omit<NullableUserEntity, 'id' | 'createdAt' | 'updatedAt'>

export type NullableUserEntity = MakeMaybe<UserEntity> & {
  password: Maybe<string>
}

export interface UserEntity extends Omit<IUser, 'password'>, Entity, Dates {}

export interface IUser {
  fullName: string
  email: string
  role: Role
  password: string
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}
