import type { UserEntity } from '_/types/users'

import { describe, expect, it, vi } from 'vitest'
import mockHttp from 'node-mocks-http'

import userService from '~/services/userService'
import authService from '~/services/authService'

import AuthError from '_/helpers/errors/AuthError'

import authController from '../authController'

describe('userController', () => {
  it('login should respond with user, accessToken, and set cookie', async (ctx) => {
    const req = mockHttp.createRequest({
      path: '/login',
    })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser<UserEntity>()
    const accessToken = 'access'
    const refreshToken = 'refresh'

    vi.spyOn(authService, 'loginUser').mockResolvedValue({ user, accessToken, refreshToken })

    await authController.login(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user, accessToken })
    expect(res.cookies.refreshToken).toBeDefined()
    expect(next).toHaveBeenCalled()
  })

  it('login should call next with error on failure', async () => {
    const req = mockHttp.createRequest({ body: {}, path: '/login' })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    vi.spyOn(authService, 'loginUser').mockImplementation(() => {
      throw new AuthError('Invalid credentials!')
    })

    await authController.login(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(AuthError))
  })

  it('refresh should call next with AuthError if no token', async () => {
    const req = mockHttp.createRequest({ cookies: {} })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    await authController.refresh(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(AuthError))
    expect(next.mock.calls[0][0].message).toBe('There is no token!')
  })

  it('refresh should call next with error if verifyRefreshToken throws', async () => {
    const req = mockHttp.createRequest({ cookies: { refreshToken: 'badtoken' } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    vi.spyOn(authService, 'verifyRefreshToken').mockImplementation(() => {
      throw new AuthError('Invalid token!')
    })

    await authController.refresh(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(AuthError))
    expect(next.mock.calls[0][0].message).toBe('Invalid token!')
  })

  it('refresh should call next with AuthError if user not found', async () => {
    const req = mockHttp.createRequest({ cookies: { refreshToken: 'token' } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    vi.spyOn(authService, 'verifyRefreshToken').mockReturnValue({ id: '1' })
    vi.spyOn(userService, 'fetchUserById').mockResolvedValue(undefined)

    await authController.refresh(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(AuthError))
    expect(next.mock.calls[0][0].message).toMatch(/Access denied/)
    expect(next.mock.calls[0][0].statusCode).toBe(403)
  })

  it('refresh should respond with user and accessToken', async (ctx) => {
    const req = mockHttp.createRequest({ cookies: { refreshToken: 'token' } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser<UserEntity>()
    const accessToken = 'access'

    vi.spyOn(authService, 'verifyRefreshToken').mockReturnValue({ id: user.id })
    vi.spyOn(userService, 'fetchUserById').mockResolvedValue(user)
    vi.spyOn(authService, 'generateAccessToken').mockReturnValue(accessToken)

    await authController.refresh(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user, accessToken })
    expect(next).toHaveBeenCalled()
  })
})
