import { Role, type IUser } from '_/types/users'

import { afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'

import * as fixtures from '_/tests/fixtures'

import { server as app } from '~/index'
import { disconnectDB } from '~/config/databaseConfig'

const request = supertest(app)

const { user, userEntity, accessToken, refreshToken } = fixtures.generateUserWithToken<IUser>({
  email: 'test@test.test',
  password: 'TdiN.73UeXL2y2Q',
  role: Role.Admin,
})

beforeEach(async (ctx) => {
  ctx.request = request
  ctx.fixtures = fixtures

  ctx.user = user
  ctx.userEntity = userEntity
  ctx.accessToken = accessToken
  ctx.refreshToken = refreshToken
})

afterAll(() => {
  disconnectDB()
})
