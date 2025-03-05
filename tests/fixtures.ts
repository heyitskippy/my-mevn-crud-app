import type { IUser } from '_/types/users'
import type { PartialDeep } from '_/types/utilities'
import { Role } from '_/types/users'

import { faker } from '@faker-js/faker'

export const generateUser = <T = IUser>(user?: PartialDeep<T>) => {
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: Role.User,
    ...user,
  } as T
}
