import type { IUser, UserEntity } from '_/types/users'
import type { PartialDeep } from '_/types/utilities'
import { Role } from '_/types/users'

import { faker } from '@faker-js/faker'

import authService from '~/services/authService'
import User from '~/models/User'

export const generateUser = <T = IUser>(user?: PartialDeep<T>) => {
  return {
    fullName: faker.person.fullName().replace("'", ' '),
    email: faker.internet.email().toLowerCase(),
    role: Role.User,
    password: '!1' + faker.internet.password({ length: 6 }),
    ...user,
  } as T
}

export const generateUserWithToken = <T = IUser>(maybeUser?: PartialDeep<T>) => {
  const user = generateUser(maybeUser)
  const userEntity: UserEntity = new User(user)

  return {
    user,
    userEntity,
    accessToken: authService.generateAccessToken(userEntity),
    refreshToken: authService.generateRefreshToken(userEntity),
  }
}
