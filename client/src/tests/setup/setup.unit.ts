import { beforeEach, afterEach, vi } from 'vitest'

import * as fixtures from './fixtures'

beforeEach(async (ctx) => {
  ctx.fixtures = fixtures
})

afterEach(() => {
  vi.clearAllMocks()
})
