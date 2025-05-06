import type { Request } from 'express'
import type { DeleteResult } from 'mongoose'
import type { ID } from '_/types'
import type { IUser, UserEntity } from '_/types/users'

import { describe, expect, it, vi } from 'vitest'
import mockHttp from 'node-mocks-http'

import mongoose from 'mongoose'

import userService from '~/services/userService'
import userController, { handleError } from '../userController'

describe('userController', () => {
  it('getAllUsers should return users or throw an error', async (ctx) => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const users = [ctx.fixtures.generateUser<UserEntity>(), ctx.fixtures.generateUser<UserEntity>()]

    vi.spyOn(userService, 'fetchUsers').mockReturnValue(Promise.resolve(users))

    await userController.getAll(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ users })

    vi.spyOn(userService, 'fetchUsers').mockImplementation(() => {
      throw Error('Error!')
    })

    await userController.getAll(req, res, next)
    expect(res.statusCode).toBe(500)
  })

  it('createUser should return user or throw an error', async (ctx) => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser<UserEntity>()

    vi.spyOn(userService, 'addUser').mockReturnValue(Promise.resolve(user))

    await userController.create(req, res, next)

    expect(res.statusCode).toBe(201)
    expect(res._getJSONData()).toEqual({ user })

    vi.spyOn(userService, 'addUser').mockImplementation(() => {
      throw Error('Error!')
    })

    await userController.create(req, res, next)
    expect(res.statusCode).toBe(500)
  })

  it('getUserById should return user or throw an error', async (ctx) => {
    const badReq = mockHttp.createRequest<Request<{ id: ID }>>({ params: { id: '123' } })
    const badRes = mockHttp.createResponse()
    const next = vi.fn()

    await userController.getById(badReq, badRes, next)
    expect(badRes.statusCode).toBe(404)

    const id = '6802179130af1928cb41a1a2'
    const user = ctx.fixtures.generateUser<UserEntity>({ id })

    const req = mockHttp.createRequest<Request<{ id: ID }>>({ params: { id } })
    const res = mockHttp.createResponse()

    vi.spyOn(userService, 'fetchUserById').mockReturnValue(Promise.resolve(user))

    await userController.getById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user })

    vi.spyOn(userService, 'fetchUserById').mockReturnValue(Promise.resolve(undefined))

    await userController.getById(req, res, next)
    expect(res.statusCode).toBe(404)
  })

  it('updateUser should return user or throw an error', async (ctx) => {
    const id = '1'

    const req = mockHttp.createRequest<Request<{ id: ID; user: IUser }>>({ params: { id } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser<UserEntity>()

    vi.spyOn(userService, 'updateUser').mockReturnValue(Promise.resolve(user))

    await userController.update(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user })

    vi.spyOn(userService, 'updateUser').mockReturnValue(Promise.resolve(undefined))

    await userController.update(req, res, next)
    expect(res.statusCode).toBe(500)
  })

  it('deleteUser should return user or throw an error', async (ctx) => {
    const id = '1'

    const req = mockHttp.createRequest<Request<{ id: ID }>>({ params: { id } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser<UserEntity>()

    vi.spyOn(userService, 'deleteUser').mockReturnValue(Promise.resolve(user))

    await userController.delete(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user })

    vi.spyOn(userService, 'deleteUser').mockReturnValue(Promise.resolve(undefined))

    await userController.delete(req, res, next)
    expect(res.statusCode).toBe(500)
  })

  it('createUserList should return users or throw an error', async (ctx) => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const users = Array.from({ length: 20 }).map(() => ctx.fixtures.generateUser<UserEntity>())

    vi.spyOn(userService, 'addUserList').mockReturnValue(Promise.resolve(users))

    await userController.createMany(req, res, next)

    expect(res.statusCode).toBe(201)
    expect(res._getJSONData()).toEqual({ users })

    vi.spyOn(userService, 'addUserList').mockImplementation(() => {
      throw Error('Error!')
    })

    await userController.createMany(req, res, next)
    expect(res.statusCode).toBe(500)
  })

  it('deleteAllUsers should return deleteResult or throw an error', async () => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const deleteResult: DeleteResult = { acknowledged: true, deletedCount: 1 }

    vi.spyOn(userService, 'deleteAllUsers').mockReturnValue(Promise.resolve(deleteResult))

    await userController.deleteAll(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual(deleteResult)

    deleteResult.acknowledged = false
    deleteResult.deletedCount = 0

    await userController.deleteAll(req, res, next)
    expect(res.statusCode).toBe(500)
  })
})

describe('handleError', () => {
  it('should handle ValidationError (422)', () => {
    const res = mockHttp.createResponse()
    const errors = {
      fieldKey: {
        message: 'The field is invalid!',
      } as mongoose.Error.ValidatorError,
    }

    const error = new mongoose.Error.ValidationError(new Error('Validation error!'))
    error.errors = errors

    handleError(error, res)

    expect(res.statusCode).toBe(422)
    expect(res._getJSONData()).toEqual({ errors: { fieldKey: 'The field is invalid!' } })
  })

  it('should handle duplicate key error (422)', () => {
    const res = mockHttp.createResponse()
    const message = 'duplicate key email: "some@email.com"'

    const error = new Error(message)

    handleError(error, res)

    expect(res.statusCode).toBe(422)
    expect(res._getJSONData()).toEqual({
      errors: {
        email: 'This email already exists!',
        server: message,
      },
    })
  })

  it('should handle error 404', () => {
    const res = mockHttp.createResponse()
    const message = "Can't find user"

    handleError(new Error(message), res, 404)

    expect(res.statusCode).toBe(404)
    expect(res._getJSONData()).toEqual({
      errors: {
        server: message,
      },
    })
  })

  it('should handle any other error (500)', () => {
    const res = mockHttp.createResponse()
    const message = 'Yet another error'

    handleError(new Error(message), res)

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toEqual({
      errors: {
        server: message,
      },
    })
  })
})
