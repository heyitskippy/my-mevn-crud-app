import type { Document } from 'mongoose'

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface UserEntity {
  fullName: string
  email: string
  role: Role
}

export interface MongoUser extends UserEntity, Document {}
