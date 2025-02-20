import { beforeEach, afterEach, vi } from 'vitest'

import * as fixtures from './fixtures.integration'

beforeEach(async (ctx) => {
  ctx.fixtures = fixtures
})

afterEach(() => {
  vi.clearAllMocks()
})
