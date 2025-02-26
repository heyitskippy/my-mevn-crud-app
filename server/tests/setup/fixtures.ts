import type { IUser } from '../../../types/users'
import { Role } from '../../../types/users'

import { faker } from '@faker-js/faker'

export const generateUser = (user?: IUser) => {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: Role.User,
    ...user,
  }
}
