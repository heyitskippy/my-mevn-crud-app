import { beforeEach, afterEach, vi } from 'vitest'

import * as fixtures from '_/tests/fixtures'

beforeEach(async (ctx) => {
  ctx.fixtures = fixtures

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

afterEach(() => {
  vi.clearAllMocks()
})
