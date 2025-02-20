import type { Entity, Dates } from '.'

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
