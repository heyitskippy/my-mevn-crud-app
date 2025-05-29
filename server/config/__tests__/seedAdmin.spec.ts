import { Role } from '_/types/users'

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

vi.mock('~/services/userService', async () => ({
  default: {
    addUser: vi.fn(),
  },
}))

vi.mock('~/models/User', async () => ({
  default: {
    findOne: vi.fn(),
  },
}))

vi.mock('~/config/databaseConfig', async () => ({
  connectDB: vi.fn(),
  disconnectDB: vi.fn(),
}))

describe('seedAdmin', () => {
  let addUserMock: ReturnType<typeof vi.fn>
  let findOneMock: ReturnType<typeof vi.fn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(async () => {
    vi.resetModules()

    const userService = await import('~/services/userService')
    const User = await import('~/models/User')

    addUserMock = userService.default.addUser as ReturnType<typeof vi.fn>
    findOneMock = User.default.findOne as ReturnType<typeof vi.fn>

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    vi.clearAllMocks()
  })

  it('should not create admin if already exists', async () => {
    findOneMock.mockResolvedValueOnce({ email: ADMIN_EMAIL })

    const { seedAdmin } = await import('../seedAdmin')
    await seedAdmin()

    expect(findOneMock).toHaveBeenCalledWith({ email: ADMIN_EMAIL })
    expect(addUserMock).not.toHaveBeenCalled()
  })

  it('should create admin if not exists', async () => {
    findOneMock.mockResolvedValueOnce(null)

    const { seedAdmin } = await import('../seedAdmin')
    await seedAdmin()

    expect(findOneMock).toHaveBeenCalledWith({ email: ADMIN_EMAIL })
    expect(addUserMock).toHaveBeenCalledWith({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: Role.Admin,
    })
  })

  it('should handle errors gracefully', async () => {
    findOneMock.mockRejectedValueOnce(new Error('DB Error'))

    const { seedAdmin } = await import('../seedAdmin')
    await seedAdmin()

    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Failed to seed admin:', expect.any(Error))
  })
})
