import type { HydratedDocument } from 'mongoose'
import { Role, type UserDocument, type UserEntity } from '_/types/users'

import { describe, it, expect, vi, beforeEach } from 'vitest'

import User from '~/models/User'
import userService from '~/services/userService'

import AuthError from '_/helpers/errors/AuthError'

import authService from '../authService'

describe('authService', () => {
  let user: HydratedDocument<UserDocument>

  beforeEach((ctx) => {
    user = new User(ctx.fixtures.generateUser())
    vi.restoreAllMocks()
  })

  it('loginUser should throw AuthError if user is not found', async () => {
    vi.spyOn(userService, 'fetchUserByFields').mockResolvedValue(null)

    const maybeUser = { email: user.email, password: 'pass' }

    await expect(authService.loginUser(maybeUser, false)).rejects.toThrow(AuthError)
  })

  it('loginUser should throw AuthError if password is missing', async () => {
    vi.spyOn(userService, 'fetchUserByFields').mockResolvedValue(user)

    const maybeUser = { email: user.email, password: '' }

    await expect(authService.loginUser(maybeUser, false)).rejects.toThrow(AuthError)
  })

  it('loginUser should throw AuthError if password is incorrect', async () => {
    vi.spyOn(user, 'comparePassword').mockResolvedValue(false)
    vi.spyOn(userService, 'fetchUserByFields').mockResolvedValue(user)

    const maybeUser = { email: user.email, password: 'wrong' }

    await expect(authService.loginUser(maybeUser, false)).rejects.toThrow(AuthError)
  })

  it('loginUser should return tokens for valid credentials', async () => {
    vi.spyOn(user, 'comparePassword').mockResolvedValue(true)
    vi.spyOn(userService, 'fetchUserByFields').mockResolvedValue(user)

    const maybeUser = { email: user.email, password: 'pass' }

    const result = await authService.loginUser(maybeUser, false)

    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('accessToken')
    expect(result).toHaveProperty('refreshToken')
    expect(result.user).toMatchObject({ id: user.id, email: user.email })
  })

  it('loginUser should return tokens for registration', async () => {
    const regUser: UserEntity = {
      id: 'regid',
      email: 'reg@example.com',
      fullName: 'Reg User',
      role: Role.User,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await authService.loginUser(regUser, true)

    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('accessToken')
    expect(result).toHaveProperty('refreshToken')
    expect(result.user).toMatchObject({ id: regUser.id, email: regUser.email })
  })

  it('generateAccessToken and verifyAccessToken should work', () => {
    const token = authService.generateAccessToken(user)
    const payload = authService.verifyAccessToken(token)

    expect(payload).toMatchObject({ id: user.id, email: user.email })
  })

  it('generateRefreshToken and verifyRefreshToken should work', () => {
    const token = authService.generateRefreshToken(user)
    const payload = authService.verifyRefreshToken(token)

    expect(payload).toMatchObject({ id: user.id })
  })

  it('verifyAccessToken should throw an error for invalid token', () => {
    expect(() => authService.verifyAccessToken('invalid.token')).toThrow()
  })

  it('verifyRefreshToken should throw an error for invalid token', () => {
    expect(() => authService.verifyRefreshToken('invalid.token')).toThrow()
  })
})
