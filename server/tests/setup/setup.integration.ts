import { afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'

import * as fixtures from '_/tests/fixtures'

import { server as app } from '~/index'
import { disconnectDB } from '~/config/databaseConfig'

const request = supertest(app)

beforeEach(async (ctx) => {
  ctx.request = request
  ctx.fixtures = fixtures
})

afterAll(() => {
  disconnectDB()
})
