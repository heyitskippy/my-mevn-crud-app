import { describe, expect, it, vi } from 'vitest'
import mockHttp from 'node-mocks-http'

import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import HttpError from '_/helpers/errors/HttpError'

import handleError from '../errorMiddleware'

describe('handleError', () => {
  it('should handle ValidationError (422)', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()
    const errors = {
      fieldKey: {
        message: 'The field is invalid!',
      } as mongoose.Error.ValidatorError,
    }

    const error = new mongoose.Error.ValidationError(new Error('Validation error!'))
    error.errors = errors

    handleError(error, req, res, next)

    expect(res.statusCode).toBe(422)
    expect(res._getJSONData()).toEqual({ errors: { fieldKey: 'The field is invalid!' } })
  })

  it('should handle duplicate key error (422)', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()
    const message = 'duplicate key email: "some@email.com"'

    const error = new Error(message)

    handleError(error, req, res, next)

    expect(res.statusCode).toBe(422)
    expect(res._getJSONData()).toEqual({
      errors: {
        email: 'This email already exists!',
        server: message,
      },
    })
  })

  it('should handle error 404', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()
    const message = "Can't find user"

    handleError(new HttpError(message, 404), req, res, next)

    expect(res.statusCode).toBe(404)
    expect(res._getJSONData()).toEqual({
      errors: {
        server: message,
      },
    })
  })

  it('should handle any other error (500)', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()
    const message = 'Yet another error'

    handleError(new HttpError(message), req, res, next)

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toEqual({
      errors: {
        server: message,
      },
    })
  })

  it('should handle DocumentNotFoundError (404)', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const error = new mongoose.Error.DocumentNotFoundError('Not found!')
    handleError(error, req, res, next)

    expect(res.statusCode).toBe(404)
    expect(res._getJSONData()).toEqual({ errors: { server: error.message } })
  })

  it('should handle CastError (400)', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const error = new mongoose.Error.CastError('ObjectId', 'badid', 'id')
    handleError(error, req, res, next)

    expect(res.statusCode).toBe(400)
    expect(res._getJSONData()).toEqual({ errors: { server: error.message } })
  })

  it('should handle TokenExpiredError (401)', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const error = new jwt.TokenExpiredError('jwt expired', new Date())
    handleError(error, req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res._getJSONData()).toEqual({ errors: { server: error.message } })
  })

  it('should handle JsonWebTokenError (401)', () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const error = new jwt.JsonWebTokenError('jwt malformed')
    handleError(error, req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res._getJSONData()).toEqual({ errors: { server: error.message } })
  })
})
