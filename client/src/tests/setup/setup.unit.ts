import { Role, type IUser } from '_/types/users'

import { beforeEach, afterEach, vi } from 'vitest'

import * as fixtures from '_/tests/fixtures'

const user = fixtures.generateUser<IUser>({
  email: 'test@test.test',
  password: 'TdiN.73UeXL2y2Q',
  role: Role.Admin,
})

beforeEach(async (ctx) => {
  ctx.fixtures = fixtures
  ctx.user = user

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
