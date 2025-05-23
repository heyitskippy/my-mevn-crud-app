import { describe, it, expect, vi } from 'vitest'
import mockHttp from 'node-mocks-http'

import authService from '~/services/authService'

import AuthError from '_/helpers/errors/AuthError'

import authenticate from '../authMiddleware'

describe('authenticate', () => {
  it('should call next with AuthError if Authorization header is missing', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    authenticate(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(AuthError))
    expect(next.mock.calls[0][0].message).toBe('Please log in first')
  })

  it('should call next with AuthError if Authorization header does not start with Bearer', () => {
    const req = mockHttp.createRequest({ headers: { Authorization: 'Basic xyz' } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    authenticate(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(AuthError))
    expect(next.mock.calls[0][0].message).toBe('Please log in first')
  })

  it('should call next with AuthError if verifyAccessToken throws', () => {
    const req = mockHttp.createRequest({ headers: { Authorization: 'Bearer invalidtoken' } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    vi.spyOn(authService, 'verifyAccessToken').mockImplementation(() => {
      throw new Error('Token expired')
    })

    authenticate(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(AuthError))
    expect(next.mock.calls[0][0].message).toBe('Token expired')
  })

  it('should set req.user and call next if token is valid', () => {
    const req = mockHttp.createRequest({ headers: { Authorization: 'Bearer validtoken' } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = { id: '1', email: 'test@test.com' }

    vi.spyOn(authService, 'verifyAccessToken').mockReturnValue(user)

    authenticate(req, res, next)

    expect(req.user).toEqual(user)
    expect(next).toHaveBeenCalledWith()
  })
})
