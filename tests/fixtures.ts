import type { IUser } from '_/types/users'
import type { PartialDeep } from '_/types/utilities'
import { Role } from '_/types/users'

import { faker } from '@faker-js/faker'

export const generateUser = <T = IUser>(user?: PartialDeep<T>) => {
  return {
    fullName: faker.person.fullName().replace("'", ' '),
    email: faker.internet.email().toLowerCase(),
    role: Role.User,
    password: '!1' + faker.internet.password({ length: 6 }),
    ...user,
  } as T
}
