/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Request } from 'express'
import type { DeleteResult } from 'mongoose'
import type { ID } from '_/types'
import type { IUser, UserEntity } from '_/types/users'

import { describe, expect, it, vi } from 'vitest'
import mockHttp from 'node-mocks-http'

import userService from '~/services/userService'
import handleError from '~/middlewares/errorMiddleware'

import HttpError from '_/helpers/errors/HttpError'

import userController from '../userController'

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
      throw new HttpError('Error!')
    })

    const res2 = mockHttp.createResponse()
    const next2 = vi.fn()

    await userController.getAll(req, res2, next2)

    handleError(next2.mock.calls[0][0], req, res2, next2)
    expect(res2.statusCode).toBe(500)
  })

  it('createUser should return user, handle /register path, or throw an error', async (ctx) => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser<UserEntity>()

    vi.spyOn(userService, 'addUser').mockReturnValue(Promise.resolve(user))

    await userController.create(req, res, next)

    expect(res.statusCode).toBe(201)
    expect(res._getJSONData()).toEqual({ user })
    /**
     * /register path branch
     */
    const req2 = mockHttp.createRequest({ path: '/register' })
    const res2 = mockHttp.createResponse()
    const next2 = vi.fn()

    vi.spyOn(userService, 'addUser').mockReturnValue(Promise.resolve(user))

    expect(req2.body).toEqual({})

    await userController.create(req2, res2, next2)

    expect(req2.body).toEqual(user)
    expect(next2).toHaveBeenCalled()
    expect(res2._getData()).toBe('')
    /**
     * Error branch
     */
    vi.spyOn(userService, 'addUser').mockImplementation(() => {
      throw new HttpError('Error!')
    })

    const res3 = mockHttp.createResponse()
    const next3 = vi.fn()

    await userController.create(req, res3, next3)

    handleError(next3.mock.calls[0][0], req, res3, next3)
    expect(res3.statusCode).toBe(500)
  })

  it('getUserById should return user or throw an error', async (ctx) => {
    /**
     * Invalid id
     */
    const badReq = mockHttp.createRequest<Request<{ id: ID }>>({ params: { id: '123' } })
    const badRes = mockHttp.createResponse()
    const next = vi.fn()

    await userController.getById(badReq, badRes, next)

    handleError(next.mock.calls[0][0], badReq, badRes, next)
    expect(badRes.statusCode).toBe(404)
    /**
     * Missing id
     */
    const missingReq = mockHttp.createRequest<Request>()
    const missingRes = mockHttp.createResponse()
    const missingNext = vi.fn()

    await userController.getById(missingReq, missingRes, missingNext)

    handleError(missingNext.mock.calls[0][0], missingReq, missingRes, missingNext)
    expect(missingRes.statusCode).toBe(404)
    /**
     * Valid id, user found
     */
    const id = '6802179130af1928cb41a1a2'
    const user = ctx.fixtures.generateUser<UserEntity>({ id })

    const req = mockHttp.createRequest<Request<{ id: ID }>>({ params: { id } })
    const res2 = mockHttp.createResponse()
    const next2 = vi.fn()

    vi.spyOn(userService, 'fetchUserById').mockReturnValue(Promise.resolve(user))

    await userController.getById(req, res2, next2)
    expect(res2.statusCode).toBe(200)
    expect(res2._getJSONData()).toEqual({ user })
    /**
     * Valid id, user not found
     */
    vi.spyOn(userService, 'fetchUserById').mockReturnValue(Promise.resolve(undefined))

    const res3 = mockHttp.createResponse()
    const next3 = vi.fn()

    await userController.getById(req, res3, next3)

    handleError(next3.mock.calls[0][0], req, res3, next3)
    expect(res3.statusCode).toBe(404)
    /**
     * Error branch
     */
    vi.spyOn(userService, 'fetchUserById').mockImplementation(() => {
      throw new Error('Error!')
    })

    const res4 = mockHttp.createResponse()
    const next4 = vi.fn()

    await userController.getById(req, res4, next4)

    const errorArg = next4.mock.calls[0][0]
    expect(errorArg).toBeInstanceOf(HttpError)
    expect(errorArg.message).toBe('Error!')
    expect(errorArg.statusCode).toBe(404)

    handleError(errorArg, req, res4, next4)
    expect(res4.statusCode).toBe(404)
    expect(res4._getJSONData()).toEqual({ errors: { server: 'Error!' } })
  })

  it('updateUser should return user or throw an error', async (ctx) => {
    const id = '1'

    const req = mockHttp.createRequest<Request<{ id: ID }, any, IUser>>({
      params: { id },
    })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser<UserEntity>()

    vi.spyOn(userService, 'updateUser').mockReturnValue(Promise.resolve(user))

    await userController.update(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user })

    vi.spyOn(userService, 'updateUser').mockReturnValue(Promise.resolve(undefined))

    const res2 = mockHttp.createResponse()
    const next2 = vi.fn()

    await userController.update(req, res2, next2)

    handleError(next2.mock.calls[0][0], req, res2, next2)
    expect(res2.statusCode).toBe(500)
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

    const res2 = mockHttp.createResponse()
    const next2 = vi.fn()

    await userController.delete(req, res2, next2)

    handleError(next2.mock.calls[0][0], req, res2, next2)
    expect(res2.statusCode).toBe(500)
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
      throw new HttpError('Error!')
    })

    const res2 = mockHttp.createResponse()
    const next2 = vi.fn()

    await userController.createMany(req, res2, next2)

    handleError(next2.mock.calls[0][0], req, res2, next2)
    expect(res2.statusCode).toBe(500)
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

    const res2 = mockHttp.createResponse()
    const next2 = vi.fn()

    await userController.deleteAll(req, res2, next2)

    handleError(next2.mock.calls[0][0], req, res2, next2)
    expect(res2.statusCode).toBe(500)
  })
})
