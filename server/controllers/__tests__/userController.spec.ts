import type { Request } from 'express'
import type { DeleteResult } from 'mongoose'
import type { ID } from '~/types'
import type { IUser } from '~/types/users'

import { describe, expect, it, vi } from 'vitest'
import mockHttp from 'node-mocks-http'

import userService from '~/services/userService'
import userController from '../userController'

describe('userController', () => {
  it('getAll should return users or throw an error', async (ctx) => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const users = [ctx.fixtures.generateUser(), ctx.fixtures.generateUser()]

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

  it('create should return user or throw an error', async (ctx) => {
    const req = mockHttp.createRequest()
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser()

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

  it('getById should return user or throw an error', async (ctx) => {
    const id = '1'

    const req = mockHttp.createRequest<Request<{ id: ID }>>({ params: { id } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser()

    vi.spyOn(userService, 'fetchUserById').mockReturnValue(Promise.resolve(user))

    await userController.getById(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user })

    vi.spyOn(userService, 'fetchUserById').mockReturnValue(Promise.resolve(undefined))

    await userController.getById(req, res, next)
    expect(res.statusCode).toBe(404)
  })

  it('update should return user or throw an error', async (ctx) => {
    const id = '1'

    const req = mockHttp.createRequest<Request<{ id: ID; user: IUser }>>({ params: { id } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser()

    vi.spyOn(userService, 'updateUser').mockReturnValue(Promise.resolve(user))

    await userController.update(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user })

    vi.spyOn(userService, 'updateUser').mockReturnValue(Promise.resolve(undefined))

    await userController.update(req, res, next)
    expect(res.statusCode).toBe(500)
  })

  it('delete should return user or throw an error', async (ctx) => {
    const id = '1'

    const req = mockHttp.createRequest<Request<{ id: ID }>>({ params: { id } })
    const res = mockHttp.createResponse()
    const next = vi.fn()

    const user = ctx.fixtures.generateUser()

    vi.spyOn(userService, 'deleteUser').mockReturnValue(Promise.resolve(user))

    await userController.delete(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toEqual({ user })

    vi.spyOn(userService, 'deleteUser').mockReturnValue(Promise.resolve(undefined))

    await userController.delete(req, res, next)
    expect(res.statusCode).toBe(500)
  })

  it('deleteAll should return deleteResult or throw an error', async () => {
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
